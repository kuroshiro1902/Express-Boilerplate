import { STATUS_CODE } from '@/common/constants/StatusCode';
// import { Request, Response } from 'express';
import { serverError } from './serverError';
import { UserService } from '@/services/user.service';
import { Request, Response } from '@/types';
import { AuthService } from '@/services/auth.service';
import { IUserDto, User } from '@/models/user.model';
import { z } from 'zod';

const _LoginSchema = z.object({
  username: User.schema.shape.username,
  password: User.schema.shape.password,
});

const AuthController = {
  async login(
    req: Request<z.infer<typeof _LoginSchema>>,
    res: Response<{ token: string; user: IUserDto }>
  ) {
    try {
      const { data, error } = _LoginSchema.safeParse(req.body);
      if (error) {
        return res
          .status(STATUS_CODE.INVALID_INPUT)
          .json({ isSuccess: false, message: error.message });
      }

      const { username, password } = data;
      const user = await UserService.findOneBy({ username });
      if (!user) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ isSuccess: false, message: 'Người dùng không tồn tại!' });
      }
      if (!AuthService.comparePassword(password, user.password)) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ isSuccess: false, message: 'Sai mật khẩu!' });
      }

      const token = AuthService.generateAccessToken({ id: user.id });
      return res.json({
        isSuccess: true,
        data: { token, user: User.dto(user) },
      });
    } catch (error) {
      return serverError(res, error);
    }
  },

  async signup(req: Request, res: Response) {
    try {
      const { data, error } = User.schema
        .omit({ id: true, roles: true })
        .safeParse(req.body);
      if (error) {
        return res
          .status(STATUS_CODE.INVALID_INPUT)
          .json({ isSuccess: false, message: error.message });
      }

      const { name, username, password, email, dob, avatarUrl } = data;

      const existedUser = await UserService.findOneBy({ username });
      if (existedUser) {
        return res
          .status(STATUS_CODE.CONFLICT)
          .json({ isSuccess: false, message: 'Tên đăng nhập đã tồn tại!' });
      }

      const hashedPassword = AuthService.hashPassword(password);

      const user = {
        name,
        username,
        password: hashedPassword,
        email,
        dob,
        avatarUrl,
      };

      const savedUser = await UserService.createUser(user);

      return res
        .status(STATUS_CODE.CREATED)
        .json({ isSuccess: true, data: User.dto(savedUser) });
    } catch (error) {
      return serverError(res, error);
    }
  },

  async verifyToken(req: Request, res: Response) {
    const userId = req.user?.id;
    const user = await UserService.findOneBy({ id: userId });
    if (!user) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ isSuccess: false, message: 'User không tồn tại' });
    }
    return res.status(STATUS_CODE.SUCCESS).json({
      isSuccess: true,
      data: User.dto(user),
    });
  },
};

export default AuthController;
