import {RouterContext} from 'koa-router';

export interface IParameterDecoratorOptions<T = any> {
    readonly key?: string;
    readonly transform?: (ctx: RouterContext, raw: any) => Promise<T>;
}