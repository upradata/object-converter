import { isDefined, Levels } from '@upradata/util';
import {
    RecursiveTransformer, TypeOf, RecursiveValueOpts, RecursiveTransformerOpts, Literal,
    Type, Key, LevelDetails, RecursiveValue, isRecursiveValue
} from './types';
import { isConcatenatorClass, ConcatenatorCtor } from './concatenator';


export type _BaseOpts<K extends Key = Key, T = unknown, U = T> = {
    next?: RecursiveValueOpts<BaseOpts>;
    filter?: RecursiveTransformerOpts<K, T, boolean>;
    mutate?: RecursiveTransformerOpts<K, T, U>;
    includes?: boolean;
    concatenatorCtor?: RecursiveValueOpts<ConcatenatorCtor<T, U>> | RecursiveTransformerOpts<K, T, ConcatenatorCtor<T, U>>;
};


export type BaseOpts<K extends Key = Key, T = unknown, U = T> = _BaseOpts<K, T, U> & {
    options?: RecursiveTransformerOpts<K, T, _BaseOpts<K, T, U>>;
};



export class BaseOptions<K extends Key = Key, T = unknown, U = T> {
    readonly next?: RecursiveValue<BaseOpts>;
    readonly filter: RecursiveTransformer<K, T, boolean>;
    readonly mutate: RecursiveTransformer<K, T, U>;
    readonly concatenatorCtor: RecursiveTransformer<K, T, ConcatenatorCtor<T, U>>;
    readonly options?: RecursiveTransformer<K, T, _BaseOpts<K, T, U>>;


    constructor(options: BaseOpts<K, T, U>) {
        const { options: opts, mutate, filter, concatenatorCtor, includes, next = {} } = options;

        this.next = new RecursiveValue(next);
        this.mutate = new RecursiveValue(mutate || ((_key, value) => value as unknown as U));
        this.filter = new RecursiveValue(filter || ((_key, _value) => includes || true));

        if (isConcatenatorClass(concatenatorCtor) || isRecursiveValue(concatenatorCtor) && isConcatenatorClass(concatenatorCtor.value))
            this.concatenatorCtor = new RecursiveValue((_k, _v) => concatenatorCtor as any);
        else
            this.concatenatorCtor = new RecursiveValue(concatenatorCtor as any);

        if (isDefined(opts))
            this.options = new RecursiveValue(opts);
    }
}



export type DetailsOpts<K extends Key = Key, T = unknown, U = T> = Partial<
    Record<TypeOf, BaseOpts<K, T, U>> &
    (T extends {} | [] ? Record<keyof T, BaseOpts<K, T, U>> : {})
>;


export type Node<K extends Key = Key, T = unknown> = { key: K; value: T; levelDetails: LevelDetails; };
export type Parent<K extends Key = Key, T = unknown> = { parent: Node<K, T>; };
export type Options<K extends Key = Key, T = unknown, U = T> = BaseOpts<K, T, U> & DetailsOpts<K, T, U> & Parent<K, T>;



/* eslint-disable spaced-comment */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   Options reflecting the input to convert     //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* eslint-enable spaced-comment */

type TypeOptions<K extends Key = Key> = {
    [ K2 in TypeOf ]?: BaseOpts<K, Type<K2>, unknown>
};
type OptsAndTypeOpts<K extends Key = Key, T = unknown> = BaseOpts<K, T, unknown> & TypeOptions<K>;

// & string allow to force the type to be an object and not an array or tuple
// i.e. c2: [ number, string ] => would have been [ Options, Options ]
type IsTuple<T> = T extends { length: infer N; } ? number extends N ? false : true : false;
type Indices<T> = Exclude<keyof T, keyof unknown[]>;
type KeyOf<T> = T extends Literal ? never : IsTuple<T> extends true ? Indices<T> : T extends unknown[] ? keyof T & number : keyof T;


export type ConvertOptions<T, Depth extends number = 20> = T extends Literal ? BaseOpts<null, T, unknown> :
    Depth extends 0 ? OptsAndTypeOpts<KeyOf<T>, T[ KeyOf<T> ]> :
    {
        [ K in KeyOf<T> ]?: ConvertOptions<T[ K ], Levels[ Depth ]>;
    } & OptsAndTypeOpts<KeyOf<T>, T[ KeyOf<T> ]>;


/* type CCC = ConvertOptions<{ a: number; b: [ number, string ]; }[]>;

const cc: CCC = {
    concatenatorCtor: undefined,
    filter: undefined
};
 */
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
