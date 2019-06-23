import 'reflect-metadata';
import {IMethodProxy, IRouteMetadataParameters} from '../interfaces';
import {RouterContext} from 'koa-router';
import {LAGIACRUS_KEY, LAGIACRUS_ROUTE_METADATA} from '../consts';
import {SanitizerUtils} from '../utils';

export function Get(path?: string): MethodDecorator {
    return _routeMethodDecorator('get', path);
}

export function Post(path?: string): MethodDecorator {
    return _routeMethodDecorator('post', path);
}

export function Put(path?: string): MethodDecorator {
    return _routeMethodDecorator('put', path);
}

export function Delete(path?: string): MethodDecorator {
    return _routeMethodDecorator('delete', path);
}

export function Options(path?: string): MethodDecorator {
    return _routeMethodDecorator('options', path);
}

export function Patch(path?: string): MethodDecorator {
    return _routeMethodDecorator('patch', path);
}

export function All(path?: string): MethodDecorator {
    return _routeMethodDecorator('all', path);
}

function _routeMethodDecorator(httpVerb: string, path?: string): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const methodProxy: IMethodProxy = descriptor.value[LAGIACRUS_KEY] || {};
        methodProxy.httpVerb = httpVerb;
        methodProxy.path = SanitizerUtils.sanitizePath(path);
        const method = descriptor.value;
        descriptor.value = async function (ctx: RouterContext): Promise<any> {
            const allRouteMetaDataParameters: IRouteMetadataParameters<any>[] = Reflect.getOwnMetadata(LAGIACRUS_ROUTE_METADATA, target, propertyKey);
            const args: any[] = [];
            if (allRouteMetaDataParameters !== undefined) {
                for (let routeMetaDataParameters of allRouteMetaDataParameters) {
                    args[routeMetaDataParameters.index] = await routeMetaDataParameters.handler(ctx, routeMetaDataParameters.userInfo);
                }
            }
            return method.apply(this, args);
        };
        descriptor.value[LAGIACRUS_KEY] = methodProxy;
        return descriptor;
    };
}