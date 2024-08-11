import { Request, Response } from '@/types';
import Joi from 'joi';
import { serverError } from './serverError';
import { UserService } from '@/services/user.service';
import { STATUS_CODE } from '@/common/constants/StatusCode';
import { UserDTO } from '@/models/user.model';

const _GetUserByIdSchema = Joi.object<{ userId: number }>({
  userId: Joi.number().integer().positive().required(),
});

export const UserController = {
  async getUserById(req: Request, res: Response) {
    try {
      const { value, error } = _GetUserByIdSchema.validate(req.params);
      if (error) {
        throw new Error(error.message);
      }
      const { userId } = value;
      const user = await UserService.findOneBy({ id: userId });
      if (!user) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ isSuccess: false, message: 'User not found' });
      }
      return res
        .status(STATUS_CODE.SUCCESS)
        .json({ isSuccess: true, data: UserDTO(user) });
    } catch (error) {
      return serverError(res, error);
    }
  },
};
