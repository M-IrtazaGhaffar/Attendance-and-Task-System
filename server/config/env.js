// Load env
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const DATABASE_URL = process.env.DATABASE_URL
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
export const JWT_SECRET = process.env.JWT_SECRET
export const PORT = process.env.PORT