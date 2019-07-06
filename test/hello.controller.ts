import {Controller, Get} from '../src/decorators';

@Controller({
    path: '/hello'
})
export class HelloController {

    @Get('/')
    displayWorld(): string {
        return 'world';
    }
}