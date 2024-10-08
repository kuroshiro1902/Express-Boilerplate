import { Request, Response } from '@/types';
import jwt from 'jsonwebtoken';
import { STATUS_CODE } from '@/common/constants/StatusCode';
import { ENVIRONMENT } from '@/environments/environment';
import { ITokenPayload } from '@/models/user.model';

export function authMiddleware(req: Request, res: Response, next: any) {
  console.log('cookies: ', req.cookies);

  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(STATUS_CODE.INVALID_INPUT)
      .json({ message: 'Token not provided.' });
  }
  try {
    const decoded = jwt.verify(
      token?.replace('Bearer', '')?.replace('bearer', '')?.trim(),
      ENVIRONMENT.secretKey
    ) as ITokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ isSuccess: false, message: 'Invalid token.' });
  }
}
