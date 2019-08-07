import {RouterContext} from 'koa-router';
import {IParameterDecoratorOptions} from '../interfaces';
import {RouteParametersUtils} from '../utils';

export const Body = RouteParametersUtils.createDecoratorHandler((ctx: RouterContext, options?: IParameterDecoratorOptions | string): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request['body'], options);
});

export const Query = RouteParametersUtils.createDecoratorHandler((ctx: RouterContext, options?: IParameterDecoratorOptions | string): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request.query, options);
});

export const Headers = RouteParametersUtils.createDecoratorHandler((ctx: RouterContext, options?: IParameterDecoratorOptions | string): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request.headers, options);
});

export const Params = RouteParametersUtils.createDecoratorHandler((ctx: RouterContext, options?: IParameterDecoratorOptions | string): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.params, options);
});

export const State = RouteParametersUtils.createDecoratorHandler((ctx: RouterContext, options?: IParameterDecoratorOptions | string): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.state, options);
});
export const Req = RouteParametersUtils.createDecoratorHandler((ctx => Promise.resolve(ctx.request)));
export const Res = RouteParametersUtils.createDecoratorHandler((ctx => Promise.resolve(ctx.response)));
export const Next = RouteParametersUtils.createDecoratorHandler((ctx => Promise.resolve(ctx.next)));
