export const userRoleAssociation = {
  tableName: 'user_role',
  userForeignKey: 'user_id',
  roleForeignKey: 'role_id',
  roleAssociationAlias: 'roles',
  usersAssociationAlias: 'user',
};
