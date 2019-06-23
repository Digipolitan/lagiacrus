import {IMethodProxy} from '../interfaces';
import {LAGIACRUS_KEY} from '../consts';

export function StatusCode(number: number): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const method: IMethodProxy = descriptor.value[LAGIACRUS_KEY] || {};
        method.statusCode = number;
        return descriptor;
    }
}