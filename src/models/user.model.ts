import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { z } from 'zod';
import { IRole, Role } from './role.model';

const tableName = 'users';
const modelName = 'user';

export interface ITokenPayload {
  id: number;
}

const userSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(3).max(255),
  username: z.string().min(3).max(255),
  password: z.string().min(6).max(255),
  email: z.string().email().max(255).optional(),
  dob: z.number().int().optional(),
  avatarUrl: z.string().url().max(500).optional(),
  roles: z.array(Role.schema).optional(),
});

const userUpdateSchema = z.object({
  name: userSchema.shape.name.optional(),
  password: userSchema.shape.password.optional(),
  email: userSchema.shape.email.optional(),
  avatarUrl: userSchema.shape.avatarUrl.optional(),
  roles: userSchema.shape.roles.optional(),
});

export type IUser = z.infer<typeof userSchema>;

@Table({
  timestamps: true,
  underscored: true,
  tableName,
  modelName,
})
export class UserModel extends Model<IUser> implements IUser {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [
        userSchema.shape.password.minLength!,
        userSchema.shape.password.maxLength!,
      ],
    },
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [
        userSchema.shape.username.minLength!,
        userSchema.shape.username.maxLength!,
      ],
    },
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [
        userSchema.shape.password.minLength!,
        userSchema.shape.password.maxLength!,
      ],
    },
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  })
  declare email?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare dob?: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare avatarUrl?: string;

  declare roles?: IRole[];
}

const userDto = (user: IUser) => {
  const { id, name, email, dob, avatarUrl, roles } = user;
  return {
    id,
    name,
    email,
    dob,
    avatarUrl,
    roles: roles?.map((r) => ({ name: r.name })),
  };
};

export const User = {
  get schema() {
    return userSchema;
  },
  get updateSchema() {
    return userUpdateSchema;
  },
  get model() {
    return UserModel;
  },
  dto: userDto,
};
