export interface PlainObject<T> {
    [key: string]: T;
}


export type Function1<Arg = any, Return = any> = (arg: Arg) => Return;
export type Function2<Arg1= any, Arg2= any, Return= any> = (arg1: Arg1, arg2: Arg2) => Return;



export type LiteralType = number | string | boolean | undefined | null;
export type LiteralInString = 'number' | 'string' | 'boolean' | 'undefined' | 'null';

/* class Literal {
    number: 'number';
    string: 'string';
    boolean: 'boolean';
    undefined: 'undefined';
    null: 'null';
}
 */
