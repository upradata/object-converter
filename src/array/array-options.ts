import { isBoolean } from '@upradata/util';
import { Key, typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { ConvertOptsBase, ConvertOptions } from '../options.types';
import { ArrayReturnable } from '../returnable';


export type ArrayConvertOptions = ConvertOptions; /* <{
    // elements of array can be anything
    [ K in TypeOfLiterals | 'object' | 'array' ]?: ConvertOptions } | ConvertOptions | boolean
> */;


export class ArrayOptions extends ElementOptions {
    constructor(options: ArrayConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as ConvertOptsBase : options),
            returnableCtor: ArrayReturnable
        });
    }


    protected getDetailedOptions(_key: Key, value: unknown): ConvertOptsBase {
        return this.details[ typeOf(value) ] || this.base;
    }
}
