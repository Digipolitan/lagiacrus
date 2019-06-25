import {LAGIACRUS_ROUTE_METADATA, RouteHandlerDecorator} from '../consts';
import {IParameterDecoratorOptions, IRouteMetadataParameters} from '../interfaces';
import {RouterContext} from 'koa-router';

export class RouteParametersUtils {

    public static createDecorator<T>(handler: RouteHandlerDecorator<T>): (userInfo?: T) => ParameterDecorator {
        return (userInfo?: T) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
            const routeMetaDataParameters: IRouteMetadataParameters<T>[] = Reflect.getOwnMetadata(LAGIACRUS_ROUTE_METADATA, target, propertyKey) || [];
            routeMetaDataParameters.push({
                index: parameterIndex,
                userInfo,
                handler
            });
            Reflect.defineMetadata(LAGIACRUS_ROUTE_METADATA, routeMetaDataParameters, target, propertyKey);
        };
    }

    public static defaultDecoratorHandler<T>(ctx: RouterContext, data?: any, options?: IParameterDecoratorOptions<T> | string): Promise<T> {
        ctx.assert(data, 400);
        if (typeof options === 'string') {
            options = {
                key: options as string
            }
        } else {
            options = options || {};
        }
        if (options.key !== undefined) {
            ctx.assert(data.hasOwnProperty(options.key), 400);
            data = data[options.key];
        }
        if(options.transform !== undefined) {
            return options.transform(ctx, data);
        }
        return data;
    }
}