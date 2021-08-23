import { isArray, isDefined, isNull, ObjectOf } from '@upradata/util';


export type Key = number | string;

export type TransformerDetails = { level: number; isLast: boolean; isLeaf: boolean; };
export type SimpleTransformer<T = unknown, R = unknown> = (key?: number | string, element?: T, details?: TransformerDetails) => R;


const isRecursiveProp = (v: any): v is RecursiveProp<any> => {
    return v instanceof RecursiveProp || isDefined(v?.value);
};


export type RecursivePropOpts<T> = RecursiveProp<T> | T;

export class RecursiveProp<T> {
    value: T;
    recursive?: boolean = false;

    constructor(options: RecursivePropOpts<T>) {
        Object.assign(this, isRecursiveProp(options) ? options : { value: options });
    }
}


export type RecursiveTransformerOpts<T = unknown, R = unknown> = {
    transform: SimpleTransformer<T, R>;
    recursive?: boolean;
} | RecursivePropOpts<SimpleTransformer<T, R>>;


export class RecursiveTransformer<T = unknown, R = unknown> extends RecursiveProp<SimpleTransformer<T, R>>{

    constructor(options: RecursiveTransformerOpts<T, R>, recursive?: boolean) {

        const getOptions = () => {
            if (typeof options === 'function')
                return { value: options, recursive: !!recursive };

            if (isRecursiveProp(options))
                return options;

            return { value: options.transform, recursive: !!recursive || options.recursive };
        };

        super(getOptions());
    }
}


/* export class RecursiveTransformer2<T = unknown, R = unknown> {
    transform: SimpleTransformer<T, R>;
    recursive?: boolean = false;

    constructor(transform: RecursiveTransformer<T, R> | SimpleTransformer<T, R>, recursive?: boolean) {
        if (isRecursiveProp(transform)) {
            Object.assign(this, transform);
        } else {
            this.transform = transform;
            this.recursive = false;
        }

        if (isDefined(recursive))
            this.recursive = recursive;
    }
} */

// export type Transformer<T = unknown, R = unknown> = SimpleTransformer<T, R> | RecursiveTransformer<T, R>;

export const makeRecursive = <T>(options: RecursivePropOpts<T>): RecursiveProp<T> => {
    return new RecursiveProp(options);
};

export const makeRecursiveTransform = <T, R>(transform: RecursiveTransformerOpts<T, R>): RecursiveTransformer<T, R> => {
    return new RecursiveTransformer(transform, true);
};



export interface _Literals {
    number: number;
    string: string;
    boolean: boolean;
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

    if (typeof value === 'bigint')
        return 'number';

    return typeof value as any;
};
