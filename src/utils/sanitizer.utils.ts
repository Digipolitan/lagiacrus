import {IControllerOptions} from '../interfaces';

export class SanitizerUtils {

    public static sanitizePath(...components: string[]): string {
        let res = '/';
        let resFinishWithSeparator;
        let componentStartWithSeparator ;
        for (let component of components) {
            resFinishWithSeparator = res[res.length - 1] === '/';
            if (component !== undefined && component.length > 0) {
                componentStartWithSeparator = component[0] === '/';
                if (componentStartWithSeparator === true) {
                    if (resFinishWithSeparator === true) {
                        res += component.slice(1);
                        continue;
                    }
                } else if (resFinishWithSeparator === false) {
                    res += '/' + component;
                    continue;
                }
                res += component;
            }
        }
        return res;
    }

    public static sanitizeControllerOptions(options?: IControllerOptions): IControllerOptions {
        options = options || {};
        options.path = SanitizerUtils.sanitizePath(options.path);
        return options;
    }
}