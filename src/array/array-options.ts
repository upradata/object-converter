import { isBoolean } from '@upradata/util';
import { Key, typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { BaseOpts, Options } from '../options';
import { ArrayReturnable } from '../returnable';


export type ArrayConvertOptions = Options;

export class ArrayOptions extends ElementOptions {
    constructor(options: ArrayConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as BaseOpts : options),
            returnableCtor: ArrayReturnable
        });
    }


    protected getDetailedOptions(key: Key, value: unknown): BaseOpts {
        return { ...this.details[ key ], ...this.details[ typeOf(value) ] };
    }
}
