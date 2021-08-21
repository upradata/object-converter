import { isBoolean, isDefined } from '@upradata/util';
import { typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { OptsBase, Options } from '../options.types';
import { LiteralReturnable } from '../returnable';


/* export type LiteralConvertOptions = ConvertOptions<
    { [ K in TypeOfLiterals ]?: ConvertOptions } | ConvertOptions | boolean
>; */

export type LiteralConvertOptions = Options;


export class LiteralOptions extends ElementOptions {
    constructor(options: LiteralConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as OptsBase : options),
            returnableCtor: LiteralReturnable
        });
    }



    protected getDetailedOptions(_key: number | string, value: unknown): OptsBase {
        const type = typeOf(value);

        if (type === 'object' || type === 'array')
            throw new Error(`A LiteralElement cannot be an "${type}"`);

        const typeOptions = this.details[ type ];
        const nextOptions = this.base.next;

        if (isDefined(typeOptions || nextOptions)) {
            return { ...nextOptions, ...typeOptions };
        }

        return this.details[ type ] || this.base;
    }

}
