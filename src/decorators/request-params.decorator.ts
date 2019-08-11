import {RouterContext} from 'koa-router';
import {RouteParametersUtils} from '../utils';
import {IParameterProxy, RouteParameterTransformer} from '../interfaces';

export const Body = RouteParametersUtils.createRouteDataDecorator(<T = any>(ctx: RouterContext, parameterProxy?: IParameterProxy<T>): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, parameterProxy, ctx.request['body']);
});

export const Query = RouteParametersUtils.createRouteDataDecorator(<T = any>(ctx: RouterContext, parameterProxy?: IParameterProxy<T>): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, parameterProxy, ctx.request.query);
});

export const Headers = RouteParametersUtils.createRouteDataDecorator(<T = any>(ctx: RouterContext, parameterProxy?: IParameterProxy<T>): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, parameterProxy, ctx.request.headers);
});

export const Params = RouteParametersUtils.createRouteDataDecorator(<T = any>(ctx: RouterContext, parameterProxy?: IParameterProxy<T>): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, parameterProxy, ctx.params);
});

export const State = RouteParametersUtils.createRouteDataDecorator(<T = any>(ctx: RouterContext, parameterProxy?: IParameterProxy<T>): Promise<any> => {
    return RouteParametersUtils.defaultDecoratorHandler(ctx, parameterProxy, ctx.state);
});

export const Transform = (rpt: RouteParameterTransformer): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
        routeMetaDataParameter.parameterProxy.transform = rpt;
    };
};

export const Optional = (): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
        routeMetaDataParameter.parameterProxy.isOptional = true;
    };
};

export const Req = (): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
        routeMetaDataParameter.handler = (ctx) => Promise.resolve(ctx.req);
    };
};

export const Res = (): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
        routeMetaDataParameter.handler = (ctx) => Promise.resolve(ctx.response);
    };
};

export const Next = (): ParameterDecorator => {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
        routeMetaDataParameter.handler = (ctx) => Promise.resolve(ctx.next);
    };
};
