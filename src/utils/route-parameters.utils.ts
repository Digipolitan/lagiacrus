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
                index: parameterIndex
            };
            routeMetaDataParameters.push(routeMetaDataParameter);
        }
        return routeMetaDataParameter;
    }

    public static createDecoratorHandler<T>(handler: RouteHandlerDecorator<T>): (userInfo?: T) => ParameterDecorator {
        return (userInfo?: T) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
            const routeMetaDataParameter = this.getRouteMetaDataParameter(target, propertyKey, parameterIndex);
            routeMetaDataParameter.handler = handler;
            routeMetaDataParameter.parameterProxy = userInfo;
        };
    }

    public static defaultDecoratorHandler<T>(ctx: RouterContext, data?: any, options?: IParameterProxy<T> | string): Promise<T> {
        let parameterOptions: IParameterProxy<T>;
        if (typeof options === 'string') {
            parameterOptions = {
                key: options as string
            };
        } else {
            parameterOptions = options || {};
        }
        if (data === undefined) {
            if (parameterOptions.isOptional !== true) {
                throw HttpError.badRequest
            }
            return undefined;
        }
        const key = parameterOptions.key;
        if (key !== undefined) {
            if (data[key] === undefined) {
                if (parameterOptions.isOptional !== true) {
                    throw HttpError.badRequest
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
