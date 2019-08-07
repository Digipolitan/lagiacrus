import {ValidationError} from 'class-validator';

export class HttpError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    public static readonly badRequest = new HttpError('Bad Request', 400);
    public static readonly unauthorized = new HttpError('Unauthorized', 401);
    public static readonly forbidden = new HttpError('Forbidden', 403);
    public static readonly notFound = new HttpError('Not Found', 404);
    public static readonly conflict = new HttpError('Conflict', 409);
    public static readonly internalServerError = new HttpError('Internal Server Error', 500);

    public static validationErrors(errors: ValidationError[]): HttpError {
        if(process.env.NODE_ENV !== 'development') {
            return this.badRequest;
        }
        return new HttpError(errors.map((err) => err.toString(true)).join('\n'), 400);
    }
}
