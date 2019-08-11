import {RouterContext} from 'koa-router';
import {IController} from './interfaces';
import {IParameterProxy} from './interfaces/parameter-proxy.interface';

export const LAGIACRUS_KEY = '__lagiacrus';

export const LAGIACRUS_ROUTE_METADATA = 'lagiacrus:route';

export type ControllerConstructor = {new (...args: any[]): IController};
export type ControllerConstructorOrInstance = ControllerConstructor | IController;
export type ControllerProvider = () => ControllerConstructorOrInstance[];
export type RouteHandlerDecorator<T> = (ctx: RouterContext, parameterProxy?: IParameterProxy<T>) => Promise<any>;
