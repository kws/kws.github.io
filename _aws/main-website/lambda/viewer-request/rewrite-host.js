export const handler = async (event) => {
  const request = event.Records[0].cf.request;

  // Set the desired Host header value
  request.headers['host'] = [{ key: 'Host', value: 'kws.github.io' }];

  return request;
};