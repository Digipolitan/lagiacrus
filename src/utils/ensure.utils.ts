import {ClassTransformOptions, plainToClass} from 'class-transformer';
import {validate as validateClass, ValidationError, ValidatorOptions} from 'class-validator';
import {ITransformOptions, RouteParameterTransformer} from '../interfaces';
import {RouterContext} from 'koa-router';

export class EnsureUtils {

    private static readonly booleanFalseMapping: { [key: string]: boolean } = {
        '': false,
        '0': false,
        'false': false,
        'n': false,
        'no': false
    };

    public static defaultClassTransformOptions?: ClassTransformOptions = undefined;

    public static defaultValidatorOptions?: ValidatorOptions = undefined;

    public static toBoolean(raw: any): boolean {
        const type = typeof raw;
        if (type === 'string') {
            const str = (raw as string).toLowerCase().trim();
            const isFalse = this.booleanFalseMapping[str];
            return isFalse !== false;
        }
        if (type === 'number') {
            return raw !== 0;
        }
        if (type === 'bigint') {
            return raw !== BigInt(0);
        }
        if (type === 'object') {
            return raw !== null;
        }
        return raw !== undefined;
    };

    public static toInt(raw: any): number {
        const type = typeof raw;
        if (type === 'string') {
            return Number.parseInt(raw as string, 10);
        }
        return this.ensureNumber(type, raw);
    };

    public static toFloat(raw: any): number {
        const type = typeof raw;
        if (type === 'string') {
            return Number.parseFloat(raw as string);
        }
        return this.ensureNumber(type, raw);
    };

    public static toClass<T>(classType: { new(...args : any[]): T }, raw: any, options?: ClassTransformOptions): T | undefined {
        const res = plainToClass(classType, raw, options || this.defaultClassTransformOptions);
        return Array.isArray(res) ? res[0] : res;
    }

    public static validateClass<T = any>(obj: T, options?: ValidatorOptions): Promise<ValidationError[]> {
        return validateClass(obj, options || EnsureUtils.defaultValidatorOptions);
    }

    public static toArray<T>(classType: { new(...args : any[]): T }, raw: any, options?: ClassTransformOptions): T[] {
        const res = plainToClass(classType, raw, options || this.defaultClassTransformOptions);
        return Array.isArray(res) ? res : [res];
    }

    public static async validateArray<T = any>(objs: T[], options?: ValidatorOptions): Promise<ValidationError[]> {
        let errors: ValidationError[] = [];
        for(const obj of objs) {
            errors = await this.validateClass(objs, options);
            if(errors.length > 0) {
                return errors;
            }
        }
        return errors;
    }

    private static ensureNumber(type: string, raw: any): number {
        if (type === 'boolean') {
            if (raw === true) {
                return 1;
            }
            return 0;
        }
        if (type === 'number') {
            return raw as number;
        }
        if (type === 'bigint') {
            return raw.asIntN;
        }
        return NaN;
    }
}
