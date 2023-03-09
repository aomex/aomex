import type { JWTResolverLoader } from './jwt';

export const resolveAuthorizationHeader: JWTResolverLoader = (ctx) => {
  const authHeader = ctx.request.headers['authorization'];
  if (!authHeader) return null;
  const parts = authHeader.trim().split(' ');

  if (parts.length === 2) {
    const scheme = parts[0]!;
    const credentials = parts[1]!;
    if (/^Bearer$/i.test(scheme)) return credentials;
  }

  ctx.throw(
    401,
    'Bad Authorization header format. Format is "Authorization: Bearer <token>"',
  );
  return null;
};

export const resolveCookies: JWTResolverLoader = (ctx, options) => {
  return options.cookie ? ctx.request.cookie[options.cookie] : null;
};
