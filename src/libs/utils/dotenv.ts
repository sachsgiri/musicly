import * as path from 'node:path';
import { config } from 'dotenv';

// Initializing dotenv
const envPath: string = path.resolve(__dirname, process.env.NODE_ENV === 'test' ? '../../../.env.test' : '../../../../.env');
config({ path: envPath });
