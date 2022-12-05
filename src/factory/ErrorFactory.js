const SystemError = require('../exception/SystemError');

class ErrorFactory {
    static create(error, message) {
        if (error.status == 400) {
            if (error.message) console.log(' !--  ErrorFactory message', error.message);
            else console.log(' !--  ErrorFactory object had no message property');
            return error;
        } else {
            console.log(error);
            return new SystemError(message || "System error");
        }
    }
}

module.exports = ErrorFactory;