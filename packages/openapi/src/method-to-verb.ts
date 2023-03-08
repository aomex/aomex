// Explain filed `operationId` to against ibm-openapi-validator warning
export const methodToVerb = (method: string, uri: string) => {
  method = method.toLowerCase();

  if (method === 'get' && !uri.includes(':')) return 'list';
  if (method === 'post') return 'create';
  if (method === 'put') return 'replace';
  if (method === 'patch') return 'update';
  return method;
};
