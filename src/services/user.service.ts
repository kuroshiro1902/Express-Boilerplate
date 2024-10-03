import { DEFAULT_ROLE_ID } from '@/constants/role.constant';
import { DB } from '@/database/database';
import { Role } from '@/models/role.model';
import { IUser } from '@/models/types/user.type';
import { User } from '@/models/user.model';

import { FindOptions } from 'sequelize';
import { z } from 'zod';

const defaultPageSize = 50;

const userFindOptions: FindOptions = {
  include: [
    {
      model: Role.model,
      as: 'roles',
      through: { attributes: [] }, // Không lấy ra bảng trung gian
    },
  ],
};

export const UserService = {
  async findAllBy(
    filter: Partial<IUser>,
    limit = defaultPageSize
  ): Promise<IUser[]> {
    const _filter = User.schema.partial().parse(filter);
    const users = await User.model.findAll({
      where: _filter,
      limit,
      ...userFindOptions,
    });

    return users.map((user) => user.get({ plain: true }));
  },

  async findOneBy(filter: Partial<IUser>): Promise<IUser | null> {
    const _filter = User.schema.partial().parse(filter);
    const user = await User.model.findOne({
      where: _filter,
      ...userFindOptions,
    });
    return user?.get({ plain: true }) ?? null;
  },

  async createUser(input: Omit<IUser, 'id'>): Promise<IUser> {
    const userInput = User.schema.omit({ id: true }).parse(input);
    const createdUser = await DB.transaction(async (transaction) => {
      const user = await User.model.create(userInput as IUser, { transaction });
      await user.$set('roles', [DEFAULT_ROLE_ID], { transaction });
      return user;
    });
    const user = await createdUser.reload(userFindOptions);
    return user.get({ plain: true });
  },

  async updateUser(
    userId: number,
    patchValue: z.infer<typeof User.updateSchema>
  ): Promise<IUser> {
    const _userId = User.schema.shape.id.parse(userId);
    const _patchValue = User.updateSchema.parse(patchValue);
    const user = await User.model.findOne({
      where: { id: _userId },
    });
    if (!user) {
      throw new Error(`Không tìm thấy user!`);
    }
    const updatedUser = await user.update(_patchValue);
    return updatedUser.get({ plain: true });
  },
};
