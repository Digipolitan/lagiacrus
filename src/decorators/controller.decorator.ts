import {IControllerOptions} from '../interfaces';
import {ControllerConstructor} from '../consts';
import {SanitizerUtils} from '../utils';

export function Controller(options?: IControllerOptions) {
    return function<T extends ControllerConstructor>(constructor: T) {
        return class extends constructor {
            public readonly __lagiacrus: IControllerOptions = SanitizerUtils.sanitizeControllerOptions(options);
        };
    };
}