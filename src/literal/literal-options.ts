import { isBoolean } from '@upradata/util';
import { typeOf } from '../types';
import { ElementOptions } from '../element-options';
import { BaseOpts, Options } from '../options';
import { LiteralReturnable } from '../returnable';

export type LiteralConvertOptions = Options;


export class LiteralOptions extends ElementOptions {
    constructor(options: LiteralConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as BaseOpts : options),
            returnableCtor: LiteralReturnable
        });
    }



    protected getDetailedOptions(_key: number | string, value: unknown): BaseOpts {
        const type = typeOf(value);

        if (type === 'object' || type === 'array')
            throw new Error(`A LiteralElement cannot be an "${type}"`);

        return this.details[ type ];
    }

}
