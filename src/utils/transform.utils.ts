import {RouterContext} from 'koa-router';
import {ITransformOptions, RouteParameterTransformer} from '../interfaces';
import {EnsureUtils} from './ensure.utils';
import {HttpError} from '../http.error';

export class TransformUtils {

    public static toBoolean: RouteParameterTransformer = (ctx: RouterContext, raw: any): Promise<boolean> => {
        return Promise.resolve(EnsureUtils.toBoolean(raw));
    };

    public static toInt: RouteParameterTransformer = (ctx: RouterContext, raw: any): Promise<number> => {
        return Promise.resolve(EnsureUtils.toInt(raw));
    };

    public static toFloat: RouteParameterTransformer = (ctx: RouterContext, raw: any): Promise<number> => {
        return Promise.resolve(EnsureUtils.toFloat(raw));
    };

    public static toClass<T>(classType: { new(...args : any[]): T }, options: ITransformOptions = { validate: true }): RouteParameterTransformer<T> {
        return async (ctx: RouterContext, raw: any): Promise<T> => {
            const obj = EnsureUtils.toClass(classType, raw, options.transform);
            if(options.validate !== false) {
                const errors = await EnsureUtils.validateClass(obj, typeof options.validate === 'boolean' ? undefined : options.validate);
                if(errors.length > 0) {
                    throw HttpError.validationErrors(errors);
                }
            }
            return obj;
        }
    }

    public static toArray<T>(classType: { new(...args : any[]): T }, options: ITransformOptions = { validate: true }): RouteParameterTransformer<T[]> {
        return async (ctx: RouterContext, raw: any[]): Promise<T[]> => {
            const objs = EnsureUtils.toArray(classType, raw, options.transform);
            if(options.validate !== false) {
                const errors = await EnsureUtils.validateArray(objs, typeof options.validate === 'boolean' ? undefined : options.validate);
                if(errors.length > 0) {
                    throw HttpError.validationErrors(errors);
                }
            }
            return objs;
        }
    }
}
