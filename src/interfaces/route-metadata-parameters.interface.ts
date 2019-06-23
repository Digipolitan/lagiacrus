import {RouteHandlerDecorator} from '../consts';

export interface IRouteMetadataParameters<T> {
    readonly index: number;
    readonly userInfo?: T;
    readonly handler: RouteHandlerDecorator<T>;
}