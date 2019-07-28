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
        let parameterOptions: IParameterDecoratorOptions<T>;
        if (typeof options === 'string') {
            parameterOptions = {
                key: options as string
            }
        } else {
            parameterOptions = options || {};
        }
        if (data === undefined) {
            if (parameterOptions.isOptional !== true) {
                ctx.throw(400);
            }
            return undefined;
        }
        const key = parameterOptions.key;
        if (key !== undefined) {
            if (data[key] === undefined) {
                if (parameterOptions.isOptional !== true) {
                    ctx.throw(400);
                }
                return undefined;
            }
            data = data[key];
        }
        const transform = parameterOptions.transform;
        if(transform !== undefined) {
            return transform(ctx, data);
        }
        return data;
    }
}