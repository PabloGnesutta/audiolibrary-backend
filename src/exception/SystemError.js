class SystemError extends Error {
    constructor(message) {
        super(message);
        this.status = 500;
        console.log('system error message', message)
    }
}

module.exports = SystemError;