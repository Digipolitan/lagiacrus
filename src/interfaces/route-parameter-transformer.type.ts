import {RouterContext} from 'koa-router';

export type RouteParameterTransformer<T = any> = (ctx: RouterContext, raw: any) => Promise<T>;
