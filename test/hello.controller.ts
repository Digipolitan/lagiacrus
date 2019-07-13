import {Body, Controller, Get, Middleware, Params, Post, Put, Query, Res, StatusCode} from '../src/decorators';
import {TransformUtils as T} from '../src/utils';
import {HelloCreateDTO} from './hello-create.dto';
import {Request, Response} from 'koa';
import bodyParser = require('koa-bodyparser');
import {HttpError} from '../src';

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
        transform: T.toInt
    }) type: number): string {
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
            throw HttpError.conflict();
        }
    }
}