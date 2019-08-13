import * as Koa from 'koa';
import {Middleware} from 'koa';
import {MiddlewaresBuilder} from './middlewares-builder.type';

export interface ServerOptions {
    readonly basePath?: string;
    readonly middlewares?: Middleware[] | MiddlewaresBuilder;
    readonly app?: Koa;
}
