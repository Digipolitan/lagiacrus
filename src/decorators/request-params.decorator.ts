import {RouterContext} from 'koa-router';
import {IParameterDecoratorOptions} from '../interfaces';
import {RouteParametersUtils} from '../utils';

export const Body = RouteParametersUtils.createDecorator((ctx: RouterContext, options?: IParameterDecoratorOptions): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request['body'], options);
});

export const Query = RouteParametersUtils.createDecorator((ctx: RouterContext, options?: IParameterDecoratorOptions): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request.query, options);
});

export const Headers = RouteParametersUtils.createDecorator((ctx: RouterContext, options?: IParameterDecoratorOptions): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.request.headers, options);
});

export const Params = RouteParametersUtils.createDecorator((ctx: RouterContext, options?: IParameterDecoratorOptions): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.params, options);
});

export const State = RouteParametersUtils.createDecorator((ctx: RouterContext, options?: IParameterDecoratorOptions): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, ctx.state, options);
});
export const Req = RouteParametersUtils.createDecorator((ctx => Promise.resolve(ctx.request)));
export const Res = RouteParametersUtils.createDecorator((ctx => Promise.resolve(ctx.response)));
export const Next = RouteParametersUtils.createDecorator((ctx => Promise.resolve(ctx.next)));

