/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as path from 'node:path';
import { SlonikMigrator } from '@slonik/migrator';
import * as dotenv from 'dotenv';
import { createPool } from 'slonik';

// use .env or .env.test depending on NODE_ENV variable
const envPath = path.resolve(__dirname, process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env');
dotenv.config({ path: envPath });

export async function getMigrator() {
  const pool = await createPool(
    `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  );

  const migrator = new SlonikMigrator({
    migrationsPath: path.resolve(__dirname, 'migrations'),
    migrationTableName: 'migration',
    slonik: pool,
  } as any);

  return { pool, migrator };
}
