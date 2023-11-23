import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorFactory } from '@/utils';
dotenv.config();

const SECRET: jwt.Secret = process.env.SECRET_KEY || 'DAMASCO_AZUL';
const EXPIRED_TIME = process.env.TOKEN_EXP_TIME || '24h';

const createToken = (userId: number) => {
  const payload = { id: userId };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRED_TIME });
};

async function decodedToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;

    if (!decoded) throw errorFactory.unauthorized('invalid token');

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) throw errorFactory.unauthorized('jtw expired');
  }
}
export { createToken, decodedToken };
