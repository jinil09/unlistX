import mysql from 'mysql2/promise';

type Pool = mysql.Pool;

declare global {
  var __UNLISTX_MYSQL_POOL__: Pool | undefined;
}

function getPool(): Pool {
  if (global.__UNLISTX_MYSQL_POOL__) return global.__UNLISTX_MYSQL_POOL__;

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
    queueLimit: 0,
    // optionally add ssl in production if required by provider
    // ssl: { rejectUnauthorized: true }
  });

  global.__UNLISTX_MYSQL_POOL__ = pool;
  return pool;
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  const pool = getPool();
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}


export default getPool;
