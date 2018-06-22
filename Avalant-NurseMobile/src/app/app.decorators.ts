/***
 * Application Decorators
 * 
 * @author NorrapatN
 * @since Thu Jun 01 2017
 */

export function Enumerable(flag: boolean = true) {
  return <PropertyDecorator>(target: Object, field: string) => {
    Object.defineProperty(target, field, {
      enumerable: flag,
      configurable: true,
      value: void 0
    });
  };
}
