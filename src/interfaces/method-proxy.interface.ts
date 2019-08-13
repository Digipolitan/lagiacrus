import {Middleware} from 'koa';
import {MiddlewaresBuilder} from './middlewares-builder.type';

export interface IMethodProxy {
    httpVerb?: string;
    statusCode?: number;
    path?: string;
    middlewares?: Middleware[] | MiddlewaresBuilder;
}
