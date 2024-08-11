import Joi from 'joi';
import { VALIDATOR } from '@/common/validators/Validator';
import { DB } from '@/database/database';
import { DataTypes, Model } from 'sequelize';

const tableName = 'users';
const modelName = 'User';

export interface IUser {
  id: number;
  name: string;
  username: string;
  password: string;
  email?: string;
  dob?: number;
  avatarUrl?: string;
}

export interface ITokenPayload {
  id: number;
}

const UserSchema = Joi.object<IUser>({
  // id: Joi.number().integer().positive(),
  name: Joi.string().max(32).required(),
  username: Joi.string().max(32).required(),
  password: Joi.string().max(255).required(),
  email: Joi.string().email().max(64),
  dob: VALIDATOR.unixTimestamp(),
  avatarUrl: Joi.string().uri().max(255),
}).unknown(false);

const UpdateableUserSchema = Joi.object<Partial<IUser>>({
  name: Joi.string().max(32).required(),
  password: Joi.string().max(255).required(),
  email: Joi.string().email().max(64),
  dob: VALIDATOR.unixTimestamp(),
  avatarUrl: Joi.string().uri().max(255),
}).unknown(false);

export const UserValidate = (input: any) => {
  return VALIDATOR.schemaValidate(UserSchema, input);
};

export const UpdateUserValidate = (patchValue: Partial<IUser>) => {
  return VALIDATOR.schemaValidate(UpdateableUserSchema, patchValue);
};

export const UserModel = DB.define<Model<IUser>, IUser>(
  modelName,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {},
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    dob: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName,
    timestamps: true,
    hooks: {},
    underscored: true,
  }
);

export const UserDTO = (user: IUser) => {
  const { id, name, avatarUrl, dob, email } = user;
  return { id, name, avatarUrl, dob, email };
};
