import { Pool } from "pg";


// PostgreSQL connection configuration
const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    // password: process.env.NEXT_PUBLIC_DB_PASS,
    password: 'pass',
    port: 5432, // Default PostgreSQL port
  });
  
  // Query wrapper function to reuse in components
  export const query = async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows;
  };