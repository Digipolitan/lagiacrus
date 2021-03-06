import * as Koa from 'koa';
import {ControllerConstructorOrInstance} from './consts';
import {SanitizerUtils} from './utils';
import {RouterBuilder} from './router-builder';
import {ServerOptions} from './interfaces';
import * as http from 'http';
import {Middleware} from 'koa';

export class Server {

    public readonly app: Koa;
    public readonly basePath: string;
    private server?: http.Server;

    public constructor(options: ServerOptions = {}) {
        this.app = options.app || new Koa();
        this.basePath = SanitizerUtils.sanitizePath((options.basePath || '/'));
        let middlewares = options.middlewares;
        if (middlewares !== undefined) {
            if(!Array.isArray(middlewares)) {
                middlewares = middlewares.apply(this) as Middleware[];
            }
            for (const middleware of middlewares) {
                this.app.use(middleware);
            }
        }
    }

    public mount(...controllers: ControllerConstructorOrInstance[]): void {
        controllers.forEach((constructorOrInstance) => {
            const router = RouterBuilder.buildController(constructorOrInstance, this.basePath);
            this.app.use(router.allowedMethods());
            this.app.use(router.routes());
        });
    }

    public start(port: string | number, listeningListener?: () => void): http.Server {
        if (this.isStarting) {
            throw new TypeError('The server cannot be started, it\'s already listening');
        }
        if (typeof port === 'string') {
            port = parseInt(port as string, 10);
        }
        this.server = this.app.listen(port as number, listeningListener);
        return this.server;
    }

    public get isStarting(): boolean {
        return this.server !== undefined;
    }

    public close(): Promise<http.Server> {
        return new Promise<http.Server|undefined>((resolve, reject) => {
           if (!this.isStarting) {
               reject(new TypeError('The server cannot be closed, its not listening yet'));
               return;
           }
            const server = this.server;
            this.server = undefined;
            server.close((err?: Error) => {
               if (err !== undefined) {
                   reject(err);
                   return;
               }
               resolve(server);
           });
        });
    }
}

