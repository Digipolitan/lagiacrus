import {Controller, Get, Params, Query} from '../src/decorators';
import {Transform} from 'class-transformer';
import {TransformUtils} from '../src/utils';

@Controller({
    path: '/hello'
})
export class HelloController {

    @Get('/')
    displayWorld(): string {
        return 'world';
    }

    @Get('/check')
    world(@Query({
        key: 'type',
        transform: TransformUtils.toInt
    }) type: number): string {
        return typeof type;
    }

    @Get('/check/:bool')
    params(@Params({
       key: 'bool',
       transform: TransformUtils.toBoolean
    }) type: boolean): boolean {
        return type;
    }
}