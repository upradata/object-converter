import { isArray, isDefined, isNull, ObjectOf } from '@upradata/util';


export type Key = number | string;

export type LevelDetails = { level: number; isLast: boolean; isLeaf: boolean; };
export type SimpleTransformer<T = unknown, R = unknown> = (key?: Key, value?: T, details?: LevelDetails) => R;


export type RecursiveValueOpts<T = unknown> = RecursiveValue<T> | T;

export const isRecursiveValue = (v: any): v is RecursiveValue => {
    return v instanceof RecursiveValue || isDefined((v as RecursiveValue)?.value);
};

export class RecursiveValue<T = unknown> {
    value: T;
    recursive?: boolean = false;

    constructor(options: RecursiveValueOpts<T>, recursive?: boolean) {
        Object.assign(this, (isRecursiveValue(options) ? options : { value: options }));

        if (isDefined(recursive))
            this.recursive = recursive;
    }
}


export type RecursiveTransformer<T = unknown, R = unknown> = RecursiveValue<SimpleTransformer<T, R>>;
export type RecursiveTransformerOpts<T = unknown, R = unknown> = RecursiveValueOpts<SimpleTransformer<T, R>>;


export const makeRecursive = <T>(options: RecursiveValueOpts<T>): RecursiveValue<T> => {
    return new RecursiveValue(options, true);
};


export interface _Literals {
    number: number;
    bigint: bigint;
    string: string;
    boolean: boolean;
    symbol: Symbol;
    function: Function;
    undefined: undefined;
    null: null;
}


export type Literal = _Literals[ keyof _Literals ];
export type TypeOfLiterals = keyof _Literals;

export type TypeOf = TypeOfLiterals | 'array' | 'object';


export type Type<T extends TypeOf> = T extends 'array' ? Array<unknown> : T extends 'object' ? ObjectOf<unknown> : _Literals[ T & TypeOfLiterals ];


export const typeOf = (value: unknown): TypeOf => {
    if (isNull(value))
        return 'null';

    if (isArray(value))
        return 'array';

    return typeof value;
};
