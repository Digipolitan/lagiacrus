import {Middleware} from 'koa';
import {ControllerConstructorOrInstance, ControllerProvider} from '../consts';
import {IRouterOptions} from 'koa-router';

export interface IControllerOptions {
    readonly path?: string;
    readonly middlewares?: Middleware[];
    readonly children?: ControllerConstructorOrInstance[] | ControllerProvider;
    readonly router?: IRouterOptions;
}
