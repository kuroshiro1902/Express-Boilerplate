import Joi from 'joi';
import { VALIDATOR } from '@/common/validators/Validator';
import { DB } from '@/database/database';
import { DataTypes, Model } from 'sequelize';

const tableName = 'roles';
const modelName = 'Role';

export interface IRole {
  id: number;
  name: string;
}

const RoleSchema = Joi.object<IRole>({
  // id: Joi.number().integer().positive(),
  name: Joi.string().max(32).required(),
}).unknown(false);

const UpdateableRoleSchema = Joi.object<Partial<IRole>>({
  name: Joi.string().max(32).required(),
}).unknown(false);

export const RoleValidate = (input: any) => {
  return VALIDATOR.schemaValidate(RoleSchema, input);
};

export const UpdateRoleValidate = (patchValue: Partial<IRole>) => {
  return VALIDATOR.schemaValidate(UpdateableRoleSchema, patchValue);
};

export const RoleModel = DB.define<Model<IRole>, IRole>(
  modelName,
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {},
    },
  },
  {
    tableName,
    timestamps: true,
    hooks: {},
  }
);

export const RoleDTO = (role: IRole) => {
  const { id, name } = role;
  return { id, name };
};
