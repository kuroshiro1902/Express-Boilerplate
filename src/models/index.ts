import { userRoleAssociation } from './associations/user-role.association';
import { Role } from './role.model';
import { User } from './user.model';
import { DB } from '@/database/database';

export const initModels = async () => {
  DB.addModels([User.model, Role.model]);

  // USER-ROLE ASSOCIATION - M:N
  User.model.belongsToMany(Role.model, {
    through: userRoleAssociation.tableName,
    foreignKey: userRoleAssociation.userForeignKey,
    otherKey: userRoleAssociation.roleForeignKey,
    timestamps: true,
  });
  Role.model.belongsToMany(User.model, {
    through: userRoleAssociation.tableName,
    foreignKey: userRoleAssociation.roleForeignKey,
    otherKey: userRoleAssociation.userForeignKey,
    timestamps: true,
  });

  await DB.sync({ logging: false, alter: true });
};
