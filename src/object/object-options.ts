import { isBoolean, isDefined } from '@upradata/util';
import { ElementOptions } from '../element-options';
import { OptsBase, Options } from '../options.types';
import { ObjectReturnable } from '../returnable';
import { Key, typeOf } from '../types';


// export type PropOptions = ObjectOf<ConvertOptions | boolean>;


/* export type ObjectConvertOptions<T = {}> = ConvertOptions<
    { [ K in TypeOfLiterals | keyof T | 'object' | 'array' ]?: ConvertOptions } | ConvertOptions | boolean
>; */
export type ObjectConvertOptions<T = {}> = Options<T>;


export class ObjectOptions extends ElementOptions {
    constructor(options: ObjectConvertOptions | boolean) {
        super({
            ...(isBoolean(options) ? { includes: true } as OptsBase : options),
            returnableCtor: ObjectReturnable
        });
    }


    protected getDetailedOptions(key: Key, value: unknown): OptsBase {

        // key is prop name of the property (i.e. {a:1} => "a")
        const keyOptions = this.details[ key ];
        const typeOptions = this.details[ typeOf(value) ];
        const nextOptions = this.base.next;

        if (isDefined(keyOptions || typeOptions || nextOptions))
            return { ...nextOptions, ...typeOptions, ...keyOptions };

        return this.base;
    }

}
