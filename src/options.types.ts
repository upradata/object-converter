import { isDefined } from '@upradata/util';

import { Transformer, RecursiveTransformer, TypeOf } from './types';
import { ReturnableConstructor } from './returnable';

type Transform<T = unknown> = Transformer<T> | RecursiveTransformer<T>;

export type ConvertOptsBase = {
    filter?: Transform<boolean>;
    mutate?: Transform;
    overwrite?: Transform<Omit<ConvertOptsBase, 'overwrite'>>;
    // specific?: T; // Option[];
    // synonyms of element
    // object?: unknown;
    // array?: unknown;
    // properties?: unknown;
    // all elements in value
    // all?: boolean;
    includes?: boolean;
    returnableCtor?: ReturnableConstructor;
};



export class ConvertOptionsBase {
    readonly filter: RecursiveTransformer<boolean>;
    readonly mutate: RecursiveTransformer;
    readonly overwrite?: RecursiveTransformer<Omit<ConvertOptsBase, 'overwrite'>>;


    constructor(options: ConvertOptsBase) {
        const { overwrite, mutate, filter, includes } = options;

        this.mutate = new RecursiveTransformer(mutate || ((_index: number, value: unknown) => value));
        this.filter = new RecursiveTransformer(filter || ((_index: number, _value: unknown) => includes || true));
        if (isDefined(overwrite))
            this.overwrite = new RecursiveTransformer(overwrite);
    }
}



export type ConvertOptsDetails<T = unknown> = Partial<
    Record<TypeOf, ConvertOptsBase> &
    (T extends {} | [] ? Record<keyof T, ConvertOptsBase> : {})
>;

export type ConvertOptions<T = unknown> = ConvertOptsBase & ConvertOptsDetails<T>;
