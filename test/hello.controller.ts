import {Body, Controller, Get, Middleware, Params, Post, Put, Query, Res, StatusCode, Transform, Optional} from '../src/decorators';
import {TransformUtils as T} from '../src/utils';
import {HelloCreateDTO} from './hello-create.dto';
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
    world(@Transform(T.toInt) @Optional() @Query('type') type: number = 12): string {
        return typeof type;
    }

    @Get('/check/:bool')
    params(@Params('bool') @Transform(T.toBoolean) type: boolean): boolean {
        return type;
    }

    @Middleware(
        () => [bodyParser()]
    )
    @Post('/create')
    create(@Body() @Transform(T.toClass(HelloCreateDTO)) hello: HelloCreateDTO) {
        return hello.say;
    }

    @Put('/update')
    @StatusCode(204)
    update(@Query('error') @Optional() @Transform(T.toBoolean) error?: boolean) {
        if (error === true) {
            throw HttpError.conflict;
        }
    }
}
