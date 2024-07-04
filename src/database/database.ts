import { ENVIRONMENT } from '@/environments/environment';
import { Sequelize } from 'sequelize';

const { uri } = ENVIRONMENT.db;
export const DB = new Sequelize(uri, {});
