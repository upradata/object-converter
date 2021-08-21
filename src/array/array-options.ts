import { isBoolean, isDefined } from '@upradata/util';
import { Key, typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { OptsBase, Options } from '../options.types';
import { ArrayReturnable } from '../returnable';


export type ArrayConvertOptions = Options; /* <{
    // elements of array can be anything
    [ K in TypeOfLiterals | 'object' | 'array' ]?: ConvertOptions } | ConvertOptions | boolean
> */


export class ArrayOptions extends ElementOptions {
    constructor(options: ArrayConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as OptsBase : options),
            returnableCtor: ArrayReturnable
        });
    }


    protected getDetailedOptions(key: Key, value: unknown): OptsBase {
        const keyOptions = this.details[ key ];
        const typeOptions = this.details[ typeOf(value) ];
        const nextOptions = this.base.next;

        if (isDefined(keyOptions || typeOptions || nextOptions)) {
            return { ...nextOptions, ...typeOptions, ...keyOptions };
        }

        return this.base;
    }
}
