import {Body, Controller, Get, Middleware, Params, Post, Put, Query, Res, StatusCode} from '../src/decorators';
import {TransformUtils as T} from '../src/utils';
import {HelloCreateDTO} from './hello-create.dto';
import bodyParser = require('koa-bodyparser');
import {HttpError, OptionalParameterDecoratorOptions} from '../src';
import {Transform} from 'class-transformer';

@Controller({
    path: '/hello'
})
export class HelloController {

    @Get('/')
    displayWorld(): string {
        return 'world';
    }

    @Get('/check')
    world(@Transform() @Optional() @Query('type') type: number = 12): string {
        console.log(type);
        return typeof type;
    }

    @Get('/check/:bool')
    params(@Params({
       key: 'bool',
       transform: T.toBoolean
    }) type: boolean): boolean {
        return type;
    }

    @Middleware(
        bodyParser()
    )
    @Post('/create')
    create(@Body({
        transform: T.toClass(HelloCreateDTO)
    }) hello: HelloCreateDTO) {
        return hello.say;
    }

    @Put('/update')
    @StatusCode(204)
    update(@Query({
        key: 'error',
        isOptional: true,
        transform: T.toBoolean
    }) error?: boolean) {
        if (error === true) {
            throw HttpError.conflict;
        }
    }
}
