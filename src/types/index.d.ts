import { ITokenPayload } from '@/models/user.model';
import { Request as ERequest, Response as EResponse } from 'express';

export type Request<T = { [key: string]: string }> = ERequest<T> & {
  user?: ITokenPayload;
};
export interface ResponseBody<T = any> {
  isSuccess?: boolean;
  data?: T;
  message?: string;
}
export type Response<T = any> = EResponse<ResponseBody<T>>;
