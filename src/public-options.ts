import { Levels, IfThenElse as If, Is } from '@upradata/util';
import { TypeOf, Literal, GetType, Key } from './types';
import * as Types from './types';
// import { BaseOpts as OriginalBaseOpts } from './options';
import { ConcatenatorCtor } from './concatenator';

/*
type RecursiveValueOpts<T> = RecursiveValue<unknown> | T;
type RecursiveTransformer<K extends Key = Key, T = unknown, R = unknown> = RecursiveValue<SimpleTransformer<K, T, R>>;
type RecursiveTransformerOpts<K extends Key = Key, T = unknown, R = unknown> = RecursiveValueOpts<SimpleTransformer<K, T, R>>;
 */

type State = {
    isTypeOptions: boolean;
    onlyRecursive: boolean;
    level: number;
};

type InitState<N extends number> = {
    isTypeOptions: false;
    onlyRecursive: false;
    level: N;
};


type SetState<OldS extends State, NewS extends Partial<State>> = Omit<OldS, keyof NewS> & NewS;


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


type _BaseOpts<K extends Key, T, S extends State> = {
    next?: ConvertOptions<T, S>;
    filter?: RecursiveTransformOpts<K, T>;
    mutate?: RecursiveTransformOpts<K, T>;
    includes?: boolean;
    concatenatorCtor?: RecursiveValueOpts<ConcatenatorCtor<T>> | RecursiveTransformOpts<K, T, ConcatenatorCtor<T>>;
};


type BaseOpts<K extends Key, T, S extends State = InitState<0>> = _BaseOpts<K, T, S> & {
    options?: RecursiveTransformOpts<K, T, _BaseOpts<K, T, S>>;
};

type OnlyRecursiveBaseOpts<K extends Key, T, S extends State> = {
    next?: ConvertOptions<T, SetState<S, { onlyRecursive: true; }>>;
    filter?: OnlyRecursiveTransformOpts<K, T>;
    mutate?: OnlyRecursiveTransformOpts<K, T>;
    includes?: boolean;
    concatenatorCtor?: RecursiveValue<ConcatenatorCtor<T>> | OnlyRecursiveTransformOpts<K, T, ConcatenatorCtor<T>>;
    options?: OnlyRecursiveTransformOpts<K, T, _BaseOpts<K, T, S>>;
};


/* eslint-disable spaced-comment */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   Options reflecting the input to convert     //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


declare const _Stop: unique symbol;
type Stop = typeof _Stop;


// & string allow to force the type to be an object and not an array or tuple
// i.e. c2: [ number, string ] => would have been [ Options, Options ]
// any[], Array<any>, Readonly<any> => length: number, [T,T,T,T] => length = 4
type IsTuple<T> = T extends { length: infer N; } ? number extends N ? false : true : false;
type Indices<T> = Exclude<keyof T, keyof unknown[]>;
type KeyOf<T> = T extends Literal ? never : IsTuple<T> extends true ? Indices<T> : T extends unknown[] ? keyof T & number : keyof T;

type ExtractTypeKeys<T, Type, V = never> = {
    [ K in KeyOf<T> ]?: T[ K ] extends Type ?
    T[ K ] extends unknown[] ? object extends Type ? V : K : K : V

    /* If<Is<T[ K ], Type>,
        // when Type is object, any[] and object will pass the test
        // so we are obliged to be sure to fail when any[] extends object
        If<
            Is<T[ K ], unknown[]>,
            If<Is<object, Type>, V, K>,
            K>,
        V> */
}[ KeyOf<T> ];

type ExtractType<T, Type> = T[ ExtractTypeKeys<T, Type> ];


/////////////////////////////////////////////

// null has to be dealt appart and first
type SimpleKey<Type> = Type extends null ? Key : Type extends unknown[] ? number  /* : Type extends object ? Key */ : Key;


// K extends Stop has to be kept to allow distribution, If<Is<K,Stop>, ....> will block it
type _TypeOptions<K extends Key, E, Type, S extends State> = [ K ] extends [ Stop ] ?
    OnlyRecursiveBaseOpts<SimpleKey<Type>, Type, S> :
    K extends Stop ? never :
    BaseOpts<K, E, S> & ConvertOptions<E, SetState<S, { isTypeOptions: true; }>>;

type TypeOptions<T, S extends State> = {
    [ Type in TypeOf ]?: _TypeOptions<
        ExtractTypeKeys<T, GetType<Type>, Stop>,
        ExtractType<T, GetType<Type>>,
        GetType<Type>,
        S>
};

type _BaseOptions<T, S extends State> = S[ 'isTypeOptions' ] extends true ? {} : BaseOpts<KeyOf<T>, T[ KeyOf<T> ], S>;
// If<S[ 'isTypeOptions' ], {}, BaseOpts<KeyOf<T>, T[ KeyOf<T> ], S>>;

type ObjectConvertOptions<T, S extends State> = {
    [ K in KeyOf<T> ]?: ConvertOptions<T[ K ], SetState<S, { level: Levels[ S[ 'level' ] ]; }>>;
};


/////////////////////////////////////////////

export type ConvertOptions<T, S extends State = InitState<20>> =
    // [ T ] extends [ Literal ] avoid type distribution => C<A|B> and not C<A> | C<B>
    // We want to have mutate: (key, value) => any to have key and value to have a union type and not mutate
    // https://github.com/microsoft/TypeScript/issues/29368
    // If<...> is working also, but to be sure, I keep it like that
    [ T ] extends [ Literal ] ? S[ 'isTypeOptions' ] extends true ? {} : BaseOpts<null, T> :
    //  If<S[ 'isTypeOptions' ], {}, BaseOpts<null, T>> :
    // I stopped distribution, so I have to test exclude here T extends Literal
    T extends Literal ? never :
    S[ 'level' ] extends 0 ?
    TypeOptions<T, S> & _BaseOptions<T, S> :
    ObjectConvertOptions<T, S> & TypeOptions<T, S> & _BaseOptions<T, S>;
/* If<
    Is<S[ 'level' ], 0>,
    TypeOptions<T, S> & _BaseOptions<T, S>,
    ObjectConvertOptions<T, S> & TypeOptions<T, S> & _BaseOptions<T, S>
>; */


/* eslint-enable spaced-comment */



// b: [ number, string ]; c: number;  },  { a: number; b: [ number, string ]; c: number; }, { a: number; b: [ number, string ]; c: number; }
type CCC = ConvertOptions<[ { a: number; }, { b: string; }/*  number, string */ ]>;

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
        filter2: (_k, _v) => 'true'
    }
};



const dd: ConvertOptions<[ number ]> = {
    number: {
        filter: (_k, _v) => _v[ 0 ]
    }
};


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
    e: { e1: string; };
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
            recursive: false
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
