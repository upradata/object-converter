import { isDefined } from '@upradata/util';

import { RecursiveTransformer, TypeOf, Transform } from './types';
import { ReturnableConstructor } from './returnable';


export type OptsBase<T = unknown, U = unknown> = {
    next?: OptsBase<T, U>;
    filter?: Transform<T, boolean>;
    mutate?: Transform<T, U>;
    get?: Transform<Omit<OptsBase<T>, 'get'>>;
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



export class OptionsBase<T = unknown, U = unknown> {
    readonly next?: OptsBase<T, U>;
    readonly filter: RecursiveTransformer<T, boolean>;
    readonly mutate: RecursiveTransformer<T, U>;
    readonly get?: RecursiveTransformer<Omit<OptsBase<T, U>, 'get'>, U>;


    constructor(options: OptsBase<T, U>) {
        const { get, mutate, filter, includes, next } = options;

        this.next = next;
        this.mutate = new RecursiveTransformer(mutate || ((_index: number, value: T) => value as any));
        this.filter = new RecursiveTransformer(filter || ((_index: number, _value: T) => includes || true));
        if (isDefined(get))
            this.get = new RecursiveTransformer(get as any);
    }
}



export type OptsDetails<T = unknown, U = unknown> = Partial<
    Record<TypeOf, OptsBase<T, U>> &
    (T extends {} | [] ? Record<keyof T, OptsBase<T, U>> : {})
>;

export type Options<T = unknown, U = unknown> = OptsBase<T, U> & OptsDetails<T, U>;
