import { isDefined, Levels } from '@upradata/util';
import { RecursiveTransformer, TypeOf, RecursiveTransformerOpts, Literal, Type, RecursiveProp, RecursivePropOpts } from './types';
import { ReturnableConstructor } from './returnable';


export type _BaseOpts<T = unknown, U = T> = {
    next?: RecursivePropOpts<BaseOpts>;
    filter?: RecursiveTransformerOpts<T, boolean>;
    mutate?: RecursiveTransformerOpts<T, U>;
    includes?: boolean;
    returnableCtor?: ReturnableConstructor;
};


export type BaseOpts<T = unknown, U = T> = _BaseOpts<T, U> & {
    options?: RecursiveTransformerOpts<T, _BaseOpts<T, U>>;
};



export class BaseOptions<T = unknown, U = T> {
    readonly next?: RecursiveProp<BaseOpts>;
    readonly filter: RecursiveTransformer<T, boolean>;
    readonly mutate: RecursiveTransformer<T, U>;
    readonly options?: RecursiveTransformer<T, _BaseOpts<T, U>>;


    constructor(options: BaseOpts<T, U>) {
        const { options: opts, mutate, filter, includes, next } = options;

        this.next = new RecursiveProp(next);
        this.mutate = new RecursiveTransformer(mutate || ((_index: number, value: T) => value as unknown as U));
        this.filter = new RecursiveTransformer(filter || ((_index: number, _value: T) => includes || true));
        if (isDefined(opts))
            this.options = new RecursiveTransformer(opts);
    }
}



export type DetailsOpts<T = unknown, U = T> = Partial<
    Record<TypeOf, BaseOpts<T, U>> &
    (T extends {} | [] ? Record<keyof T, BaseOpts<T, U>> : {})
>;

export type Options<T = unknown, U = T> = BaseOpts<T, U> & DetailsOpts<T, U>;



/* eslint-disable spaced-comment */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   Options reflecting the input to convert     //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* eslint-enable spaced-comment */

type TypeOptions = {
    [ K in TypeOf ]?: BaseOpts<Type<K>, unknown>
};

type OptsAndTypeOpts<T = unknown> = BaseOpts<T, unknown> & Partial<TypeOptions>;

// & string allow to force the type to be an object and not an array or tuple
// i.e. c2: [ number, string ] => would have been [ Options, Options ]
type KeyOf<T> = T extends [] ? keyof T & number : keyof T & string;

export type ConvertOptions<T, Depth extends number = 20> = Depth extends 0 ? OptsAndTypeOpts<T> : T extends Literal ?
    OptsAndTypeOpts<T> :
    {
        [ K in KeyOf<T> ]?: ConvertOptions<T[ K ], Levels[ Depth ]>;
    } & OptsAndTypeOpts<T[ KeyOf<T> ]>;




/* export interface Data {
    a: number;
    b: string;
    c: [ string, number, { c1: number; c2: [ number, string ]; c3: string; } ];
    d: { d1: number; d2: string; };
}


type DataConvert = ConvertOptions<Data>;

const a: DataConvert = {
    mutate: (k, v) => `${k} ==> ${v}`,
    filter: (_k, _v) => true,
    next: {
        filter: (_k, _v) => true
    },
    null: {
        mutate: (_k, v) => !!v,
        filter: (k, v) => k === v
    },
    a: {
        mutate: {
            transform: (k, v) => k === v,
            recursive: true
        }
    },
    b: {
        mutate: (k, v) => k === v,
        filter: (_k, _v) => true,
        string: {
            mutate: (k, v) => k === v,
            filter: (k, v) => k === v,
        },
        boolean: {
            mutate: (k, v) => `${k} ==> ${v}`,
            filter: (_k, _v) => true
        }
    },
    c: {
        next: {
            filter: (_k, _v) => true
        },
        0: {
            mutate: (k, v) => k === v,
            filter: (k, v) => k === v,
        },
        object: {
            mutate: (k, v) => `${k} ==> ${v}`,
            filter: (_k, _v) => true
        }
    },
    d: {
        mutate: (k, v) => `${k} ==> ${v}`,
        filter: (_k, _v) => true,
        d2: {
            mutate: (k, v) => k === v,
            filter: (k, v) => k === v,
            includes: true
        }
    }
};


console.log(a);
 */
