export const handler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;
  
    const status = response.status;
    const locationHeader = response.headers['location'];
  
    if ((status === '301' || status === '302') && locationHeader) {
      const originalLocation = locationHeader[0].value;
  
      // Only rewrite if it redirects to kws.github.io
      if (originalLocation.startsWith('https://kws.github.io')) {
        const rewrittenLocation = originalLocation.replace(
          'https://kws.github.io',
          `https://${request.headers['host'][0].value}`
        );
  
        console.log(`Rewriting redirect: ${originalLocation} → ${rewrittenLocation}`);
  
        response.headers['location'][0].value = rewrittenLocation;
      }
    }
  
    return response;
  };
  