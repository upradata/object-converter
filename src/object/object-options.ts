import { isBoolean, isDefined } from '@upradata/util';
import { ElementOptions } from '../element-options';
import { ConvertOptsBase, ConvertOptions } from '../options.types';
import { ObjectReturnable } from '../returnable';
import { Key, typeOf } from '../types';


// export type PropOptions = ObjectOf<ConvertOptions | boolean>;


/* export type ObjectConvertOptions<T = {}> = ConvertOptions<
    { [ K in TypeOfLiterals | keyof T | 'object' | 'array' ]?: ConvertOptions } | ConvertOptions | boolean
>; */
export type ObjectConvertOptions<T = {}> = ConvertOptions<T>;


export class ObjectOptions extends ElementOptions {
    constructor(options: ObjectConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as ConvertOptsBase : options),
            returnableCtor: ObjectReturnable
        });
    }


    protected getDetailedOptions(key: Key, value: unknown): ConvertOptsBase {

        // key is prop name of the property (i.e. {a:1} => "a")
        const keyOptions = this.details[ key ];
        const typeOptions = this.details[ typeOf(value) ];

        if (isDefined(keyOptions) || isDefined(typeOptions))
            return { ...typeOptions, ...keyOptions };

        return this.base;
    }

}
