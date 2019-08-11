import {LAGIACRUS_ROUTE_METADATA, RouteHandlerDecorator} from '../consts';
import {IRouteMetadataParameters} from '../interfaces';
import {RouterContext} from 'koa-router';
import {HttpError} from '../http.error';
import {IParameterProxy} from '../interfaces/parameter-proxy.interface';

export class RouteParametersUtils {

    public static getRouteMetaDataParameter<T>(target: Object, propertyKey: string | symbol, parameterIndex: number): IRouteMetadataParameters<T> {
        let routeMetaDataParameters: IRouteMetadataParameters<T>[] = Reflect.getOwnMetadata(LAGIACRUS_ROUTE_METADATA, target, propertyKey);
        if(routeMetaDataParameters === undefined) {
            routeMetaDataParameters = [];
            Reflect.defineMetadata(LAGIACRUS_ROUTE_METADATA, routeMetaDataParameters, target, propertyKey);
        }
        let routeMetaDataParameter =  routeMetaDataParameters.find((rmdp) => rmdp.index === parameterIndex);
        if(routeMetaDataParameter === undefined) {
            routeMetaDataParameter = {
                index: parameterIndex,
                parameterProxy: {}
            };
            routeMetaDataParameters.push(routeMetaDataParameter);
        }
        return routeMetaDataParameter;
    }

    public static createRouteDataDecorator<T>(handler: RouteHandlerDecorator<T>): (key?: string) => ParameterDecorator {
        return (key?: string): ParameterDecorator => {
            return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
                const routeMetaDataParameter = RouteParametersUtils.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
                routeMetaDataParameter.parameterProxy.key = key;
                routeMetaDataParameter.handler = handler;
            };
        };
    }

    public static defaultDecoratorHandler<T>(ctx: RouterContext, parameterProxy: IParameterProxy<T>, raw?: any): Promise<T> {
        if (raw === undefined) {
            if (parameterProxy.isOptional !== true) {
                throw HttpError.badRequest
            }
            return undefined;
        }
        const key = parameterProxy.key;
        if (key !== undefined) {
            if (raw[key] === undefined) {
                if (parameterProxy.isOptional !== true) {
                    throw HttpError.badRequest
                }
                return undefined;
            }
            raw = raw[key];
        }
        const transform = parameterProxy.transform;
        if(transform !== undefined) {
            return transform(ctx, raw);
        }
        return raw;
    }
}
