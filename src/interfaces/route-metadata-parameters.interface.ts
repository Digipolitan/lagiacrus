import {RouteHandlerDecorator} from '../consts';
import {IParameterProxy} from './parameter-proxy.interface';

export interface IRouteMetadataParameters<T> {
    readonly index: number;
    parameterProxy?: IParameterProxy<T>;
    handler?: RouteHandlerDecorator<T>;
}
