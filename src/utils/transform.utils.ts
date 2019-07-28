import {RouterContext} from 'koa-router';
import {plainToClass} from 'class-transformer';
import {validate as validateClass, ValidatorOptions} from 'class-validator';
import {ITransformOptions} from '../interfaces';

export class TransformUtils {

    public static toBoolean = (ctx: RouterContext, raw: any): Promise<boolean> => {
        const type = typeof raw;
        if (type === 'string') {
            const str = (raw as string).toLowerCase().trim();
            const isFalse = booleanFalseMapping[str];
            return Promise.resolve(isFalse !== false);
        }
        if (type === 'number') {
            return Promise.resolve(raw !== 0);
        }
        if (type === 'bigint') {
            return Promise.resolve(raw !== BigInt(0));
        }
        if (type === 'object') {
            return Promise.resolve(raw !== null);
        }
        return Promise.resolve(raw !== undefined);
    };

    public static toInt = (ctx: RouterContext, raw: any): Promise<number> => {
        const type = typeof raw;
        if (type === 'string') {
            return Promise.resolve(Number.parseInt(raw as string, 10));
        }
        return toNumber(type, raw);
    };

    public static toFloat = (ctx: RouterContext, raw: any): Promise<number> => {
        const type = typeof raw;
        if (type === 'string') {
            return Promise.resolve(Number.parseFloat(raw as string));
        }
        return toNumber(type, raw);
    }

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

const booleanFalseMapping: { [key: string]: boolean } = {
    '': false,
    '0': false,
    'false': false,
    'n': false,
    'no': false
};

function toNumber(type: string, raw: any): Promise<number> {
    if (type === 'boolean') {
        if (raw === true) {
            return Promise.resolve(1);
        }
        return Promise.resolve(0);
    }
    if (type === 'number') {
        return Promise.resolve(raw as number);
    }
    if (type === 'bigint') {
        return Promise.resolve(raw.asIntN);
    }
    return Promise.resolve(NaN);
}