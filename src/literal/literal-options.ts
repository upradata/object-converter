import { isBoolean } from '@upradata/util';
import { typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { ConvertOptsBase, ConvertOptions } from '../options.types';
import { LiteralReturnable } from '../returnable';


/* export type LiteralConvertOptions = ConvertOptions<
    { [ K in TypeOfLiterals ]?: ConvertOptions } | ConvertOptions | boolean
>; */

export type LiteralConvertOptions = ConvertOptions;


export class LiteralOptions extends ElementOptions {
    constructor(options: LiteralConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as ConvertOptsBase : options),
            returnableCtor: LiteralReturnable
        });
    }



    protected getDetailedOptions(_key: number | string, value: unknown): ConvertOptsBase {
        const type = typeOf(value);

        if (type === 'object' || type === 'array')
            throw new Error(`A LiteralElement cannot be an "${type}"`);

        return this.details[ type ] || this.base;
    }

}
