class SocketCustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
        this.message = message;
    }

    toJSON() {
        return {
            error: {
                name: this.name,
                message: this.message,
                stacktrace: this.stack  // TODO in the future dont return stacktrace on prod
            }
        }
    }
}


module.exports = {
    SocketCustomError
};
