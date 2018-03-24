export type KeyType = number | string;

export interface PlainObject<T> {
    [key: string]: T;
}


export type Function2<Arg1= any, Arg2= any, Return= any> = (arg1: Arg1, arg2: Arg2) => Return;
export type Visitor = (arg1: number | string, arg2: any) => any;





/* export type LiteralType = number | string | boolean | undefined | null;
export type LiteralInString = 'number' | 'string' | 'boolean' | 'undefined' | 'null'; */


export interface Literal {
    number: number;
    string: string;
    boolean: boolean;
    undefined: undefined;
    null: null;
}


export type LiteralType = Literal[keyof Literal];
export type LiteralInString = keyof Literal;
