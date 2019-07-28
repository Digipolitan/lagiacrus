export class HttpError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    public static badRequest(): HttpError {
        return new HttpError('Bad Request', 400);
    }

    public static unauthorized(): HttpError {
        return new HttpError('Unauthorized', 401);
    }

    public static forbidden(): HttpError {
        return new HttpError('Forbidden', 403);
    }

    public static notFound(): HttpError {
        return new HttpError('Not Found', 404);
    }

    public static conflict(): HttpError {
        return new HttpError('Conflict', 409);
    }

    public static internalServerError(): HttpError {
        return new HttpError('Internal Server Error', 500);
    }
}