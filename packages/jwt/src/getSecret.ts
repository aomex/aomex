import jsonWebToken from 'jsonwebtoken'; // jsonwebtoken is CommonJS
import type { JWTSecretLoader } from './jwt';

export const getSecret = (provider: JWTSecretLoader, token: string) => {
  const decoded = jsonWebToken.decode(token, { complete: true });

  if (!decoded || !decoded.header) {
    throw new Error('token invalid');
  }

  return provider(decoded.header, decoded.payload);
};
