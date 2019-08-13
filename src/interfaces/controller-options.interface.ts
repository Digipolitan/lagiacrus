import {Middleware} from 'koa';
import {ControllerConstructorOrInstance, ControllerProvider} from '../consts';
import {IRouterOptions} from 'koa-router';
import {MiddlewaresBuilder} from './middlewares-builder.type';

export interface IControllerOptions {
    readonly path?: string;
    readonly middlewares?: Middleware[] | MiddlewaresBuilder;
    readonly children?: ControllerConstructorOrInstance[] | ControllerProvider;
    readonly router?: IRouterOptions;
}
