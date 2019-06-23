import {ControllerConstructor, ControllerConstructorOrInstance, LAGIACRUS_KEY} from '../consts';
import {IController} from '../interfaces';

export class ControllerUtils {

   public static controllerFromConstructorOrInstance(constructorOrInstance: ControllerConstructorOrInstance): IController {
       if (!constructorOrInstance.hasOwnProperty(LAGIACRUS_KEY)) { // isn't an instance or IController
           if (typeof constructorOrInstance === 'function') { // is a constructor
               constructorOrInstance = new (constructorOrInstance as ControllerConstructor)();
           }
           if (!constructorOrInstance.hasOwnProperty(LAGIACRUS_KEY)) {
               throw new TypeError(`The given controller '${constructorOrInstance.constructor.name}' isn't an instance of 'IController', you must use the @Controller class decorator before the class implementation.`);
           }
       }
       return constructorOrInstance as IController;
   }
}
