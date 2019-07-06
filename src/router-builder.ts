import * as Router from 'koa-router';
import {RouterContext} from 'koa-router';
import {Middleware} from 'koa';
import {ControllerConstructorOrInstance, LAGIACRUS_KEY} from './consts';
import {ControllerUtils, SanitizerUtils} from './utils';
import {IMethodProxy} from './interfaces';

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
        builder.middlewares(...controller[LAGIACRUS_KEY].middlewares);
        for (let key in controller) {
            if (controller[key] && controller[key][LAGIACRUS_KEY]) {
                builder.method(controller[key][LAGIACRUS_KEY], controller[key]);
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

    public middlewares(...middlewares: Middleware[]): RouterBuilder {
        if (middlewares !== undefined && middlewares.length > 0) {
            this.router.use(...middlewares);
        }
        return this;
    }

    public method(method: IMethodProxy, impl: Function): RouterBuilder {
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
                ctx.throw(500, err);
            }
        };
        const {httpVerb, path} = method;
        const middlewares = method.middlewares;
        const matcher = Router.prototype[httpVerb] || Router.prototype.all;
        const routePath = SanitizerUtils.sanitizePath(path);
        if (middlewares) {
            matcher.bind(this.router)(routePath, ...middlewares, handler);
        } else {
            matcher.bind(this.router)(routePath, handler);
        }
        return this;
    }
}