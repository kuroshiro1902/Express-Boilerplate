import { env } from 'process';

export const ENVIRONMENT = Object.freeze({
  secretKey: env.SECRET_KEY!,
  db: Object.freeze({
    uri: env.DB_URI!,
    dialect: env.DB_DIALECT!,
    host: env.DB_HOST!,
    port: +env.DB_PORT!,
    name: env.DB_NAME!,
  }),
});
