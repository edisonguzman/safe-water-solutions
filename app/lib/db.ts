import { neon } from '@neondatabase/serverless';

// Ensure the application fails gracefully if the environment variable is missing
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing. Please check your .env.local file.');
}

// Create and export the SQL connection instance
export const sql = neon(process.env.DATABASE_URL);