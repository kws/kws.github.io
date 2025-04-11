import { describe, it, expect } from 'vitest';
import { handler } from './strip-path.js';

describe('strip-path Lambda function', () => {
    it('should redirect /thesis to /thesis/', async () => {
        const event = {
            request: {
                uri: '/thesis'
            }
        };

        const result = await handler(event);
        
        expect(result).toEqual({
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: {
                    value: '/thesis/'
                }
            }
        });
    });

    it('should strip the first path component', async () => {
        const event = {
            request: {
                uri: '/first/second/third'
            }
        };

        const result = await handler(event);
        
        expect(result.uri).toBe('/second/third');
    });

    it('should handle root path', async () => {
        const event = {
            request: {
                uri: '/'
            }
        };

        const result = await handler(event);
        
        expect(result.uri).toBe('/');
    });

    it('should handle single path component', async () => {
        const event = {
            request: {
                uri: '/single'
            }
        };

        const result = await handler(event);
        
        expect(result.uri).toBe('/single');
    });

    it('should handle multiple slashes', async () => {
        const event = {
            request: {
                uri: '///first///second///'
            }
        };

        const result = await handler(event);
        
        expect(result.uri).toBe('//first///second///');
    });
}); 