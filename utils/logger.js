//import assert from 'node:assert';
import fs from 'fs';

export default class Logger {

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
        this.writeToDisk(`${logLevel}: ${JSON.stringify(message)}`);
        console.log(`${logLevel}: ${JSON.stringify(message)}`);
    }

    writeToDisk(message, filename = '/app/LOG') {
        fs.appendFile(filename, message + '\n', function (err) {
            if (err) throw err;
            console.log('Cannot write to logs to disk');
        });
    }
}
