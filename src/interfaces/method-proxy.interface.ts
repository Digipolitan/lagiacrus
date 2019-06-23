import {Middleware} from 'koa';

export interface IMethodProxy {
    httpVerb?: string;
    statusCode?: number;
    path?: string;
    middlewares?: Middleware[]
}