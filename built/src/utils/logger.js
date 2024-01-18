"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Logger {
    info(message) {
        this.log("INFO", message);
    }
    warn(message) {
        this.log("WARN", message);
    }
    error(message) {
        this.log("ERROR", message);
    }
    debug(message) {
        if (process.env.DEBUG == "true")
            this.log("DEBUG", message);
    }
    log(logLevel, message) {
        console.log(`${logLevel}: ${JSON.stringify(message)}`);
    }
    writeToDisk(message, filename = '/app/LOG') {
        fs_1.default.appendFile(filename, message + '\n', function (err) {
            if (err)
                throw err;
            console.log('Cannot write to logs to disk');
        });
    }
}
exports.default = Logger;
