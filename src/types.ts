import { isArray, isDefined, isNull } from '@upradata/util';


export type Key = number | string;

export type TransformerDetails = { level: number; isLast: boolean; isLeaf: boolean; };
export type Transformer<R = unknown> = (key?: number | string, element?: unknown, details?: TransformerDetails) => R;


const isTransformerRecursive = (transformer: any): transformer is RecursiveTransformer => {
    return transformer instanceof RecursiveTransformer || isDefined(transformer?.transform);
};

export class RecursiveTransformer<R = unknown> {
    transform: Transformer<R>;
    recursive?: boolean = false;

    constructor(transform: RecursiveTransformer<R> | Transformer<R>, recursive?: boolean) {
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

export const makeRecursiveTransform = <R>(transform: RecursiveTransformer<R> | Transformer<R>): RecursiveTransformer<R> => new RecursiveTransformer(transform, true);



interface _Literals {
    number: number;
    string: string;
    boolean: boolean;
    undefined: undefined;
    null: null;
}


export type Literal = _Literals[ keyof _Literals ];
export type TypeOfLiterals = keyof _Literals;

export type TypeOf = TypeOfLiterals | 'array' | 'object';

export const typeOf = (value: unknown): TypeOf => {
    if (isNull(value))
        return 'null';

    if (isArray(value))
        return 'array';

    if (typeof value === 'bigint')
        return 'number';

    return typeof value as any;
};
