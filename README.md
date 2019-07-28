# lagiacrus

[![npm version](https://badge.fury.io/js/lagiacrus.svg)](https://badge.fury.io/js/lagiacrus)

Koa wrapper using decorators

## Installation

`npm install lagiacrus`

## Usage



## Example 

hello.controller.ts

```typescript
@Controller({
    path: '/hello'
})
export class HelloController {

    @Get('/')
    displayWorld(): string {
        return 'world';
    }
}
```

main.ts

```typescript
async function main(): Promise<http.Server> {
    const server = new Server();
    server.mount(HelloController);
    return await server.start(3000);
}
main().then(() => console.log('Listening...')).catch(console.error);
```