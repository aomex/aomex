import { decode } from 'jsonwebtoken';
import type { JWTSecretLoader } from './jwt';

export const getSecret = (provider: JWTSecretLoader, token: string) => {
  const decoded = decode(token, { complete: true });

  if (!decoded || !decoded.header) {
    throw new Error('token invalid');
  }

  return provider(decoded.header, decoded.payload);
};
