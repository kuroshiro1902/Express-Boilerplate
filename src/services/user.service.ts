import {
  IUser,
  UpdateUserValidate,
  UserModel,
  UserValidate,
} from '@/models/user.model';

export const UserService = {
  async findAllBy(filter: Partial<IUser>) {
    const users = await UserModel.findAll({
      where: filter,
    });

    return users.map((user) => user.get({ plain: true }));
  },

  async findOneBy(filter: Partial<IUser>) {
    const user = await UserModel.findOne({
      where: filter,
    });
    return user?.get({ plain: true }) ?? null;
  },

  async saveUser(input: any) {
    const { error, value } = UserValidate(input);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
    const user = await UserModel.create(value);
    return user.get({ plain: true });
    // return user.toJSON();
  },

  async updateUser(userId: number, patchValue: Partial<IUser>) {
    const { error, value } = UpdateUserValidate(patchValue);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
    const user = await UserModel.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`Không tìm thấy user!`);
    }
    const updatedUser = await user.update(value);
    return updatedUser.get({ plain: true });
  },
};
