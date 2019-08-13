import * as Router from 'koa-router';
import {RouterContext} from 'koa-router';
import {Middleware} from 'koa';
import {ControllerConstructorOrInstance, LAGIACRUS_KEY} from './consts';
import {ControllerUtils, SanitizerUtils} from './utils';
import {IController, IMethodProxy} from './interfaces';
import {HttpError} from './http.error';

export class RouterBuilder {

    public readonly router: Router;

    public constructor(opts: Router.IRouterOptions) {
        this.router = new Router(opts);
    }

    public static buildController(constructorOrInstance: ControllerConstructorOrInstance, basePath?: string): Router {
        const controller = ControllerUtils.controllerFromConstructorOrInstance(constructorOrInstance);
        const prefix = SanitizerUtils.sanitizePath(basePath, controller[LAGIACRUS_KEY].path);
        const options = controller[LAGIACRUS_KEY].router || {};
        if (options.prefix === undefined) {
            options.prefix = prefix;
        }
        const builder = new RouterBuilder(options);
        let middlewares = controller[LAGIACRUS_KEY].middlewares;
        if (middlewares !== undefined) {
            if (!Array.isArray(middlewares)) {
                middlewares = middlewares.apply(controller) as Middleware[];
            }
            builder.middlewares(...middlewares);
        }
        for (let key in controller) {
            if (controller[key] && controller[key][LAGIACRUS_KEY]) {
                builder.method(controller, key);
            }
        }
        if (controller[LAGIACRUS_KEY].children !== undefined) {
            let children = controller[LAGIACRUS_KEY].children;
            if (!Array.isArray(children)) {
                children = children();
            }
            let childRouter;
            for (let child of children) {
                childRouter = RouterBuilder.buildController(child);
                builder.middlewares(childRouter.allowedMethods(), childRouter.routes());
            }
        }
        return builder.router;
    }

    public middlewares(... middlewares: Middleware[]): RouterBuilder {
        if (middlewares !== undefined && middlewares.length > 0) {
            this.router.use(...middlewares);
        }
        return this;
    }

    public method(controller: IController, key: string): RouterBuilder {
        const impl: Function = controller[key];
        const method: IMethodProxy = impl[LAGIACRUS_KEY];
        const handler = async (ctx: RouterContext): Promise<any> => {
            const statusCode = method.statusCode;
            if(statusCode !== undefined) {
                ctx.status = statusCode;
            }
            try {
                const res = await impl(ctx);
                if(ctx.body === undefined) {
                    ctx.body = res;
                }
            } catch(err) {
                if (err instanceof HttpError) {
                    ctx.throw(err.statusCode, err);
                    return;
                }
                ctx.throw(500, err);
            }
        };
        const {httpVerb, path} = method;
        let middlewares = method.middlewares;
        const matcher = Router.prototype[httpVerb] || Router.prototype.all;
        const routePath = SanitizerUtils.sanitizePath(path);
        if (middlewares !== undefined) {
            if (!Array.isArray(middlewares)) {
                middlewares = middlewares.apply(controller) as Middleware[];
            }
            matcher.bind(this.router)(routePath, ...middlewares, handler);
        } else {
            matcher.bind(this.router)(routePath, handler);
        }
        return this;
    }
}
