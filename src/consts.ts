import {RouterContext} from 'koa-router';
import {IController} from './interfaces';

export const LAGIACRUS_KEY = '__lagiacrus';

export const LAGIACRUS_ROUTE_METADATA = 'lagiacrus:route';

export type ControllerConstructor = {new (...args: any[]): IController};
export type ControllerConstructorOrInstance = ControllerConstructor | IController;
export type ControllerProvider = () => ControllerConstructorOrInstance[];
export type RouteHandlerDecorator<T> = (ctx: RouterContext, userInfo?: T) => Promise<any>;
