export type KeyType = number | string;

export type FunctionPartial<Return> = (key?: number | string, element?: any, level?: number, done?: boolean) => Return;
export type Visitor = FunctionPartial<any>;

export class VisitorRecursive {
    visitor: Visitor;
    recursive: boolean;

    constructor(visitor: VisitorRecursive | Visitor) {
        if (visitor !== undefined && (<VisitorRecursive>visitor).recursive !== undefined) {
            this.visitor = (<VisitorRecursive>visitor).visitor;
            this.recursive = (<VisitorRecursive>visitor).recursive;
        }
        else {
            this.visitor = visitor as Visitor;
            this.recursive = false;
        }
    }
}





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
