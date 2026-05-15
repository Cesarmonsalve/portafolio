import { neon } from '@neondatabase/serverless';

// Ensure this fails gracefully on the client or during build without env vars
const dbUrl = process.env.DATABASE_URL || '';

// Create a singleton connection
export const sql = dbUrl ? neon(dbUrl) : null;
