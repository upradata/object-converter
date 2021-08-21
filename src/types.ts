import { isArray, isDefined, isNull, ObjectOf } from '@upradata/util';


export type Key = number | string;

export type TransformerDetails = { level: number; isLast: boolean; isLeaf: boolean; };
export type Transformer<T = unknown, R = unknown> = (key?: number | string, element?: T, details?: TransformerDetails) => R;


const isTransformerRecursive = (transformer: any): transformer is RecursiveTransformer => {
    return transformer instanceof RecursiveTransformer || isDefined(transformer?.transform);
};

export class RecursiveTransformer<T = unknown, R = unknown> {
    transform: Transformer<T, R>;
    recursive?: boolean = false;

    constructor(transform: RecursiveTransformer<T, R> | Transformer<T, R>, recursive?: boolean) {
        if (isTransformerRecursive(transform)) {
            Object.assign(this, transform);
        } else {
            this.transform = transform;
            this.recursive = false;
        }

        if (isDefined(recursive))
            this.recursive = recursive;
    }
}

export type Transform<T = unknown, R = unknown> = Transformer<T, R> | RecursiveTransformer<T, R>;


export const makeRecursiveTransform = <T, R>(transform: Transform<T, R>): RecursiveTransformer<T, R> => new RecursiveTransformer(transform, true);



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
