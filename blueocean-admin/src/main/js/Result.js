export class PendingResult {}

export class ErrorResult {
    constructor(cause) {
        this.cause = cause;
    }

    get message() {
        return this.cause.message;
    }

    get statusCode() {
        return this.cause.response.status;
    }

    get statusText() {
        return this.cause.response.statusText;
    }
}

export class ResultHelper {
    static isPending(result) {
        return result instanceof PendingResult;
    }

    static isError(result) {
        return result instanceof ErrorResult;
    }
}
