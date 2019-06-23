import {ClassTransformOptions} from 'class-transformer';
import {ValidatorOptions} from 'class-validator';

export interface ITransformOptions {
    readonly transform?: ClassTransformOptions,
    readonly validate: ValidatorOptions | boolean
}