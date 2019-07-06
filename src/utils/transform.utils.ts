import {RouterContext} from 'koa-router';
import {plainToClass} from 'class-transformer';
import {validate as validateClass, ValidatorOptions} from 'class-validator';
import {ITransformOptions} from '../interfaces';

export class TransformUtils {

    public static toClass<T>(classType: { new(...args : any[]): T }, options: ITransformOptions = { validate: true }) {
        return async (ctx: RouterContext, raw: any): Promise<T> => {
            const obj = plainToClass(classType, raw, options.transform);
            if(Array.isArray(obj)) {
                ctx.throw(400);
            }
            if(options.validate !== false) {
                const errors = await validateClass(obj, typeof options.validate === 'boolean' ? undefined : options.validate);
                if(errors.length > 0) {
                    ctx.throw(400);
                }
            }
            return obj;
        }
    }

    public static toArray<T>(classType: { new(...args : any[]): T }, options: ITransformOptions = { validate: true }) {
        return async (ctx: RouterContext, raw: any[]): Promise<T[]> => {
            let objs = plainToClass(classType, raw);
            if(!Array.isArray(objs)) {
                objs = [objs]
            }
            const validate = options.validate;
            if(validate !== false) {
                let validatorOptions: ValidatorOptions | undefined;
                if (typeof validate === 'boolean') {
                    validatorOptions = undefined;
                } else {
                    validatorOptions = validate as ValidatorOptions;
                }
                for(let obj of objs) {
                    const errors = await validateClass(obj, validatorOptions);
                    if(errors.length > 0) {
                        ctx.throw(400);
                    }
                }
            }
            return objs;
        }
    }
}
