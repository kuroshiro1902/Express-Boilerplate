import { STATUS_CODE } from '@/common/constants/StatusCode';
// import { Request, Response } from 'express';
import { serverError } from './serverError';
import Joi from 'joi';
import { VALIDATOR } from '@/common/validators/Validator';
import { UserService } from '@/services/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '@/environments/environment';
import { Request, Response } from '@/types';
import { IToken, IUser, UserDTO, UserValidate } from '@/models/user.model';

export interface ILogin {
  username: string;
  password: string;
}
class AuthController {
  private _LoginSchema = Joi.object<ILogin>({
    username: Joi.string().max(32).required(),
    password: Joi.string().max(32).required(),
  });
  private _expiresIn = '7d';
  private _salt = 10;
  async login(req: Request, res: Response) {
    try {
      const { value, error, message } = VALIDATOR.schemaValidate(
        this._LoginSchema,
        req.body
      );
      if (error) {
        return res
          .status(STATUS_CODE.INVALID_INPUT)
          .json({ isSuccess: false, message });
      }

      const { username, password } = value;
      const user = await UserService.findOneBy({ username });
      if (!user) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ isSuccess: false, message: 'Người dùng không tồn tại!' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ isSuccess: false, message: 'Sai mật khẩu!' });
      }

      const token = jwt.sign({ id: user.id } as IToken, ENVIRONMENT.secretKey, {
        expiresIn: this._expiresIn,
      });
      return res.json({
        isSuccess: true,
        data: { token, user: UserDTO(user) },
      });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { value, error } = UserValidate(req.body);
      if (error) {
        return res
          .status(STATUS_CODE.INVALID_INPUT)
          .json({ isSuccess: false, message: error.message });
      }

      const { name, username, password, email, dob, avatarUrl } = value;

      const existedUser = await UserService.findOneBy({ username });
      if (existedUser) {
        return res
          .status(STATUS_CODE.CONFLICT)
          .json({ isSuccess: false, message: 'Tên đăng nhập đã tồn tại!' });
      }

      const hashedPassword = await bcrypt.hash(password, this._salt);

      const user = {
        name,
        username,
        password: hashedPassword,
        email,
        dob,
        avatarUrl,
      };

      const savedUser = await UserService.saveUser(user);

      return res
        .status(STATUS_CODE.CREATED)
        .json({ isSuccess: true, data: UserDTO(savedUser) });
    } catch (error) {
      return serverError(res, error);
    }
  }

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
      data: UserDTO(user),
    });
  }
}

export default new AuthController();
