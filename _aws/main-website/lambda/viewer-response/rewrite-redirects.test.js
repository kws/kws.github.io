import { describe, it, expect } from 'vitest';
import { handler } from './rewrite-redirects.js';

describe('rewrite-redirects Lambda@Edge handler', () => {
  const createEvent = ({ location, status = '301', host = 'www.k-si.com' }) => ({
    Records: [
      {
        cf: {
          request: {
            headers: {
              host: [{ key: 'Host', value: host }],
            },
          },
          response: {
            status,
            headers: {
              location: [{ key: 'Location', value: location }],
            },
          },
        },
      },
    ],
  });

  it('rewrites redirect to custom domain if Location is kws.github.io', async () => {
    const event = createEvent({
      location: 'https://kws.github.io/projects/botsat/',
    });

    const result = await handler(event);

    expect(result.headers.location[0].value).toBe(
      'https://www.k-si.com/projects/botsat/'
    );
  });

  it('does not rewrite if Location is already correct', async () => {
    const location = 'https://www.k-si.com/projects/botsat/';
    const event = createEvent({ location });

    const result = await handler(event);

    expect(result.headers.location[0].value).toBe(location);
  });

  it('does not rewrite non-301/302 responses', async () => {
    const location = 'https://kws.github.io/projects/botsat/';
    const event = createEvent({ location, status: '200' });

    const result = await handler(event);

    expect(result.headers.location[0].value).toBe(location);
  });

  it('handles missing location header gracefully', async () => {
    const event = {
      Records: [
        {
          cf: {
            request: {
              headers: {
                host: [{ key: 'Host', value: 'www.k-si.com' }],
              },
            },
            response: {
              status: '301',
              headers: {}, // No location header
            },
          },
        },
      ],
    };

    const result = await handler(event);

    expect(result.headers.location).toBeUndefined();
  });
});
