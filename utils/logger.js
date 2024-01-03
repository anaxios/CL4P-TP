//import assert from 'node:assert';
import { fstat } from 'node:fs';

export default class Logger {

    static info(message) {
        this.log("INFO", message);
    }
    static warn(message) {
        this.log("WARN", message);
    }
    static error(message) {
        this.log("ERROR", message);
    }
    static debug(message) {
        if (process.env.DEBUG == "true")
            this.log("DEBUG", message);
    }

    log(logLevel, message) {
        this.writeToDisk(`${logLevel}: ${message}`);
        console.log(`${logLevel}: ${message}`);
    }

    writeToDisk(message, filename = './LOG') {
        fs.appendFile(filename, message + '\n', function (err) {
            if (err) throw err;
            console.log('Cannot write to logs to disk');
        });
    }
}
