import {RouteParameterTransformer} from './route-parameter-transformer.type';

export interface IParameterProxy<T = any> {
    key?: string;
    isOptional?: boolean;
    transform?: RouteParameterTransformer<T>;
}
