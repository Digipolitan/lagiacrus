import * as Koa from 'koa';
import {Middleware} from 'koa';

export interface ServerOptions {
    readonly basePath?: string;
    readonly middlewares?: Middleware[];
    readonly app?: Koa;
}