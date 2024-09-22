import { z } from 'zod';
import { IUser } from './user.model';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

const tableName = 'roles';
const modelName = 'role';

export const roleSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1).max(32),
});

export type IRole = z.infer<typeof roleSchema>;

const roleUpdateSchema = z.object({
  name: z.string().min(1).max(32),
});

@Table({
  tableName,
  modelName,
  timestamps: true,
  underscored: true,
})
class RoleModel extends Model implements IRole {
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
      len: [roleSchema.shape.name.minLength!, roleSchema.shape.name.maxLength!],
    },
  })
  declare name: string;

  declare users?: IUser[];
}

const roleDto = (role: IRole) => {
  const { id, name } = role;
  return { id, name };
};

export const Role = {
  get schema() {
    return roleSchema;
  },
  get updateSchema() {
    return roleUpdateSchema;
  },
  get model() {
    return RoleModel;
  },
  dto: roleDto,
};
