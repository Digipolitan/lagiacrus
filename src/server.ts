import * as Koa from 'koa';
import {ControllerConstructorOrInstance} from './consts';
import {SanitizerUtils} from './utils';
import {RouterBuilder} from './router-builder';
import {ServerOptions} from './interfaces';
import * as http from 'http';

export class Server {

    public readonly app: Koa;
    public readonly basePath: string;

    public constructor(options: ServerOptions = {}) {
        this.app = options.app || new Koa();
        this.basePath = SanitizerUtils.sanitizePath((options.basePath || '/'));
        if (options.middlewares !== undefined) {
            for (const middleware of options.middlewares) {
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
        if (typeof port === 'string') {
            port = parseInt(port, 10);
        }
        return this.app.listen(port, listeningListener);
    }
}

