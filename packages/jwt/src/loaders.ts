import type { TokenLoader } from './jwt';

export const tokenFromHeader: TokenLoader = (ctx) => {
  const authHeader = ctx.request.headers['authorization'];
  if (!authHeader) return null;
  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2) return;
  if (parts[0] === 'Bearer' || parts[0] === 'bearer') return parts[1];
  return null;
};

export const tokenFromCookie: TokenLoader = (ctx, options) => {
  return options.tokenFromCookie ? ctx.request.cookies[options.tokenFromCookie] : null;
};

export const tokenFromQueryString: TokenLoader = (ctx, options) => {
  return options.tokenFromQueryString
    ? (ctx.request.query[options.tokenFromQueryString] as string | undefined)
    : null;
};
