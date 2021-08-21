import { Levels } from '@upradata/util';
import { Literal, Type, TypeOf } from './types';
import { OptsBase } from './options.types';

type TypeOptions = {
    [ K in TypeOf ]?: OptsBase<Type<K>>
};

type OptsAndTypeOpts<T = unknown, U = unknown> = OptsBase<T, U> & Partial<TypeOptions>;


export type ConvertOptions<T, Depth extends number = 20> = Depth extends 0 ? OptsAndTypeOpts : T extends Literal ?
    OptsAndTypeOpts<T> :
    {
        // & string allow to force the type to be an object and not an array or tuple
        // i.e. c2: [ number, string ] => would have been [ Options, Options ]
        [ K in keyof T & string ]?: ConvertOptions<T[ K ], Levels[ Depth ]>;
    } & OptsAndTypeOpts<T>;




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
        mutate: (k, v) => k === v,
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


console.log(a); */
