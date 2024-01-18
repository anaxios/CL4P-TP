import { Database, PostgresDatabase } from './Database.js';
import dotenv from 'dotenv'; dotenv.config();

export default class DatabaseFactory {
    static createDatabase() {
        switch (process.env.DB_TYPE) {
            case 'postgres':
                return new Database(new PostgresDatabase());
            case 'sqlite':
                return new SqliteDatabase();
            default:
                throw new Error(`Unknown database type: ${type}`);
        }
    }
}