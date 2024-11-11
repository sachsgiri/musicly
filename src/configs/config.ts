import { get } from 'env-var';
import '../libs/utils/dotenv';

// https://github.com/Sairyss/backend-best-practices#configuration

export const databaseConfig = {
  type: 'postgres',
  host: get('DB_HOST').required().asString(),
  port: get('DB_PORT').required().asIntPositive(),
  username: get('DB_USERNAME').required().asString(),
  password: get('DB_PASSWORD').required().asString(),
  database: get('DB_NAME').required().asString(),
};

export const postgresConnectionUri = `postgres://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}/${databaseConfig.database}`;

export const cacheConfig = {
  type: 'redis',
  host: get('REDIS_HOST').required().asString(),
  port: get('REDIS_PORT').required().asIntPositive(),
};

export const jwtConfig = {
  secret: get('JWT_SECRET').required().asString(),
  expiresIn: get('JWT_EXPIRES_IN').required().asString(),
};
