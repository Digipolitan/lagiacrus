import {IControllerOptions} from './controller-options.interface';

export interface IController {
    readonly __lagiacrus?: IControllerOptions;
    [key: string]: any;
}