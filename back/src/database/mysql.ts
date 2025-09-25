

import { createPool, Pool } from 'mysql2/promise';

let pool: Pool;

export async function connect() {
    pool = createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'basededatoscacei',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        waitForConnections: true,
        connectionLimit: 10,
    });
}

export async function query(sql: string, params?: any[]): Promise<any> {
    if (!pool) await connect();
    try {
        if (params) {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } else {
            const [rows] = await pool.query(sql);
            return rows;
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export async function getConnection() {
    if (!pool) await connect();
    return pool.getConnection();
}