import { Levels, IfThenElse, ribute } from '@upradata/util';
import { TypeOf, Literal, GetType, Key } from './types';
import * as Types from './types';
// import { BaseOpts as OriginalBaseOpts } from './options';
import { ConcatenatorCtor } from './concatenator';

/*
type RecursiveValueOpts<T> = RecursiveValue<unknown> | T;
type RecursiveTransformer<K extends Key = Key, T = unknown, R = unknown> = RecursiveValue<SimpleTransformer<K, T, R>>;
type RecursiveTransformerOpts<K extends Key = Key, T = unknown, R = unknown> = RecursiveValueOpts<SimpleTransformer<K, T, R>>;
 */

type RecursiveValue<T, Bool extends boolean = boolean> = Omit<Types.RecursiveValue<T>, 'recursive'> & { recursive?: Bool; };

type RecursiveValueOpts<T> =
    | T
    | RecursiveValue<T, false>
    | RecursiveValue<unknown, true>;

type RecursiveTransformOpts<K extends Key, T, R = unknown> =
    | Types.SimpleTransformer<K, T, R>
    | RecursiveValue<Types.SimpleTransformer<K, T, R>, false>
    | RecursiveValue<Types.SimpleTransformer<K, unknown, R>, true>;


type OnlyRecursiveTransformOpts<K extends Key, T, R = unknown> = RecursiveValue<Types.SimpleTransformer<K, T, R>, true>;


type _BaseOpts<K extends Key, T, Depth extends number = 0> = {
    /*  [ K2 in keyof OriginalBaseOpts ]?: K2 extends 'includes' ? OriginalBaseOpts[ K2 ] :
     K2 extends 'next' ? ConvertOptions<T, Depth> :
     OriginalBaseOpts[ K2 ] extends RecursiveValueOpts<infer U> ?
     U | ForceRecursiveValue<unknown> :
     OriginalBaseOpts<K, T>[ K2 ] */
    next?: ConvertOptions<T, Depth>;
    filter?: RecursiveTransformOpts<K, T>;
    mutate?: RecursiveTransformOpts<K, T>;
    includes?: boolean;
    concatenatorCtor?: RecursiveValueOpts<ConcatenatorCtor<T>> | RecursiveTransformOpts<K, T, ConcatenatorCtor<T>>;
};


type BaseOpts<K extends Key = Key, T = unknown, Depth extends number = 0> = _BaseOpts<K, T, Depth> & {
    options?: RecursiveTransformOpts<K, T, _BaseOpts<K, T, Depth>>;
};

type OnlyRecursiveBaseOpts<K extends Key, T, Depth extends number = 0> = {
    /* [ K2 in keyof OriginalBaseOpts ]?: K2 extends 'includes' ? OriginalBaseOpts[ K2 ] :
    K2 extends 'next' ? ConvertOptions<T, Depth> :
    OriginalBaseOpts[ K2 ] extends RecursiveValueOpts<SimpleTransformer> ? RecursiveValueOpts<SimpleTransformer<K, T>> :
    OriginalBaseOpts[ K2 ] extends RecursiveValueOpts<infer U> ?
    ForceRecursiveValue<U, true> : never */
    next?: ConvertOptions<T, Depth>;
    filter?: OnlyRecursiveTransformOpts<K, T>;
    mutate?: OnlyRecursiveTransformOpts<K, T>;
    includes?: boolean;
    concatenatorCtor?: RecursiveValue<ConcatenatorCtor<T>> | OnlyRecursiveTransformOpts<K, T, ConcatenatorCtor<T>>;
    options?: OnlyRecursiveTransformOpts<K, T, _BaseOpts<K, T, Depth>>;
};

// type AA = BaseOpts<Key, string>[ 'filter' ];


/* eslint-disable spaced-comment */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   Options reflecting the input to convert     //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


declare const _Stop: unique symbol;
type Stop = typeof _Stop;


// & string allow to force the type to be an object and not an array or tuple
// i.e. c2: [ number, string ] => would have been [ Options, Options ]
type IsTuple<T> = T extends { length: infer N; } ? number extends N ? false : true : false;
type Indices<T> = Exclude<keyof T, keyof unknown[]>;
type KeyOf<T> = T extends Literal ? never : IsTuple<T> extends true ? Indices<T> : T extends unknown[] ? keyof T & number : keyof T;

type ExtractTypeKeys<T, Type, V = never> = {
    [ K in KeyOf<T> ]?: T[ K ] extends Type ?
    // when Type is object, any[] and object will pass the test
    // so we are obliged to be sure to fail when any[] extends object
    T[ K ] extends unknown[] ? (object extends Type ? V : K) : K : V
}[ KeyOf<T> ];

type ExtractType<T, Type> = T[ ExtractTypeKeys<T, Type> ];


/////////////////////////////////////////////

type SimpleKey<Type> = Type extends null ? Key : Type extends unknown[] ? number  /* : Type extends object ? Key */ : Key;

type _TypeOptions<K extends Key, E, Type, Depth extends number = 0> = K extends Stop ? OnlyRecursiveBaseOpts<SimpleKey<Type>, Type, Depth> : BaseOpts<K, E, Depth> & ConvertOptions<E, Depth, false>;

type TypeOptions<T = unknown, Depth extends number = 0> = {
    [ Type in TypeOf ]?: _TypeOptions<ExtractTypeKeys<T, GetType<Type>, Stop>, ExtractType<T, GetType<Type>>, GetType<Type>, Depth>
};

type _BaseOptions<T = unknown, Include extends boolean = true, Depth extends number = 0> = IfThenElse<Include, BaseOpts<KeyOf<T>, T[ KeyOf<T> ], Depth>, {}>;

type ObjectConvertOptions<T, Depth extends number> = {
    [ K in KeyOf<T> ]?: ConvertOptions<T[ K ], Levels[ Depth ]>;
};


/////////////////////////////////////////////

export type ConvertOptions<T, Depth extends number = 20, AddBaseOptions extends boolean = true> =
    // [ T ] extends [ Literal ] avoid type distribution => C<A|B> and not C<A> | C<B>
    // https://github.com/microsoft/TypeScript/issues/29368
    [ T ] extends [ Literal ] ? AddBaseOptions extends true ? BaseOpts<null, T> : {} :
    Depth extends 0 ? TypeOptions<T, Depth> & _BaseOptions<T, AddBaseOptions, Depth> :
    ObjectConvertOptions<T, Depth> & TypeOptions<T, Depth> & _BaseOptions<T, AddBaseOptions, Depth>;


/* eslint-enable spaced-comment */



// b: [ number, string ]; c: number;  },  { a: number; b: [ number, string ]; c: number; }, { a: number; b: [ number, string ]; c: number; }
type CCC = ConvertOptions<[ /* { a: number; }, */number, string ]>;

const cc: CCC = {
    concatenatorCtor: undefined,
    filter: undefined,
    null: {
        filter: {
            value: (_k, _v) => true,
            recursive: true
        }
    },
    // null: {
    //     filter: {
    //         value: (_k, _v) => true,
    //         recursive: false
    //     }
    // },
    // null: (_k, _v) => true,
    object: {
        filter: (_k, v) => !!v.a
    },
    next: {
        filter: (_k, _v) => 'true'
    }
};



const dd: ConvertOptions<[ number ]> = {
    number: {
        filter: (_k, _v) => _v[ 0 ]
    }
};

type NN = TypeOptions<[ number ], 2>[ 'number' ];


type JJJ = ExtractTypeKeys<[ {
    a: number;
    b: [ number, string ];
    c: number;
}, {
    a: number;
    b: [ number, string ];
    c: number;
}, {
    a: number;
    b: [ number, string ];
    c: number;
} ], number>;


interface Data {
    a: number;
    b: string;
    c: [ string, number, { c1: number; c2: [ number, string ]; c3: string; } ];
    d: { d1: number; d2: string; };
}



type DataConvert = ConvertOptions<Data>;

const a: DataConvert = {
    object: {
        filter: (_k, _v) => true
    },
    mutate: (k, v) => `${k} ==> ${v}`,
    filter: (_k, _v) => true,
    next: {
        filter: (_k, _v) => true
    },
    // null: {
    //     mutate: (_k, v) => !!v,
    //     filter: (k, v) => k === v
    // },
    a: {
        mutate: {
            value: (k, v) => k === v,
            recursive: true
        }
    },
    b: {
        mutate: (k, v) => k === v,
        filter: (_k, _v) => true,
        // string: {
        //     mutate: (k, v) => k === v,
        //     filter: (k, v) => k === v,
        // },
        // boolean: {
        //     mutate: (k, v) => `${k} ==> ${v}`,
        //     filter: (_k, _v) => true
        // }
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
