export const methodToVerb = (method: string, uri: string) => {
  method = method.toLowerCase();

  if (method === 'get') return uri.includes(':') ? 'retrieve' : 'list';
  if (method === 'post') return 'create';
  if (method === 'put') return 'replace';
  if (method === 'patch') return 'update';
  return method;
};
