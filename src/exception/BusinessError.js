class BusinessError extends Error {
    constructor(message) {
        console.log('!-- BusinessError message', message);
        super(message);
        this.status = 400;
    }
}
module.exports = BusinessError;