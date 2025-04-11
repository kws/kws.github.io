export const handler = async (event) => {
    const request = event.Records[0].cf.request;
    
    // Extract the URI path
    let uri = request.uri;

    // Check if the URI is exactly `/thesis` (without a trailing slash)
    if (uri === '/thesis') {
        // Create a redirect response to add the trailing slash
        
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: {
                    value: uri + '/'
                },
            },
        };
    }
    
    // Split the path into components
    const pathComponents = uri.split('/');

    // Remove the first component if it exists and is not empty (e.g., handling leading `/`)
    if (pathComponents.length > 1 && pathComponents[0] === '') {
        pathComponents.shift();  // remove the empty string from the beginning
    }

    if (pathComponents.length > 1) {
        // Remove the first real path component
        pathComponents.shift();
    }

    // Rejoin the remaining path components and reassign to the request URI
    request.uri = '/' + pathComponents.join('/');

    // Return the modified request
    return request;
};
