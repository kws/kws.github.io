import { describe, it, expect } from 'vitest';
import { handler } from './rewrite-host.js';

describe('Lambda@Edge handler', () => {
  it('sets the Host header correctly', async () => {
    const mockEvent = {
      Records: [
        {
          cf: {
            request: {
              method: 'GET',
              uri: '/index.html',
              headers: {
                host: [{ key: 'Host', value: 'original-host.com' }],
              },
            },
          },
        },
      ],
    };

    const result = await handler(mockEvent);

    expect(result.headers.host[0].value).toBe('kws.github.io');
    expect(result.uri).toBe('/index.html');
  });
});
