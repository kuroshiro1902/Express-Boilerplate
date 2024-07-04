import { BelongsToManyOptions } from 'sequelize';
import { RoleModel } from './role.model';
import { UserModel } from './user.model';

export const setupAssociations = () => {
  // User n-n Role
  const userRoleAssociationOptions: BelongsToManyOptions = {
    through: 'user_role',
    timestamps: true,
  };
  UserModel.belongsToMany(RoleModel, userRoleAssociationOptions);
  RoleModel.belongsToMany(UserModel, userRoleAssociationOptions);
};
