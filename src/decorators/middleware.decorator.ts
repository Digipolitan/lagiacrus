import {IMethodProxy, MiddlewaresBuilder} from '../interfaces';
import {Middleware} from 'koa';
import {LAGIACRUS_KEY} from '../consts';

export function Middleware(middlewares: Middleware[] | MiddlewaresBuilder): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const method: IMethodProxy = descriptor.value[LAGIACRUS_KEY] || {};
        method.middlewares = middlewares;
        descriptor.value[LAGIACRUS_KEY] = method;
        return descriptor;
    };
}
