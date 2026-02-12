import mysql from 'mysql2/promise';

type Pool = mysql.Pool;

declare global {
  var __UNLISTX_MYSQL_POOL__: Pool | undefined;
}

function getPool(): Pool {
  if (global.__UNLISTX_MYSQL_POOL__) return global.__UNLISTX_MYSQL_POOL__;

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
