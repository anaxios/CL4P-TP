"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_js_1 = require("./Database.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DatabaseFactory {
    static createDatabase() {
        switch (process.env.DB_TYPE) {
            case 'postgres':
                return new Database_js_1.Database(new Database_js_1.PostgresDatabase());
            case 'sqlite':
                return new SqliteDatabase();
            default:
                throw new Error(`Unknown database type: ${type}`);
        }
    }
}
exports.default = DatabaseFactory;
