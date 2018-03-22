import { LiteralInString, LiteralType, Function2 } from './definition';
import { ListOption } from './list';
import { ObjectOption } from './object';



export class LiteralElementOption<Literal extends LiteralType, LiteralString extends LiteralInString, ReturnVisitor = any> {
    public mutate?: Function2<number, Literal, ReturnVisitor>;

    constructor(option: LiteralElementOption<Literal, LiteralString, ReturnVisitor>) {
        this.mutate = option.mutate || ((index: number, element: Literal) => element as any);
    }
}

export type LiteralElementOptionAny = LiteralElementOption<LiteralType, LiteralInString>;

class ElementOption2<Element = any> {
    stringOption?: LiteralElementOption<string, 'string'>;
    numberOption?: LiteralElementOption<number, 'number'>;
    booleanOption?: LiteralElementOption<boolean, 'boolean'>;

    undefinedOption?: LiteralElementOption<undefined, 'undefined'>;
    nullOption?: LiteralElementOption<null, 'null'>;
    objectOption?: ListOption<Element> | ObjectOption<Element, any>;
}



export class ElementOption<Element = any> {
    stringOption?: LiteralElementOption<string, 'string'>;
    numberOption?: LiteralElementOption<number, 'number'>;
    booleanOption?: LiteralElementOption<boolean, 'boolean'>;

    undefinedOption?: LiteralElementOption<undefined, 'undefined'>;
    nullOption?: LiteralElementOption<null, 'null'>;
    objectOption?: ListOption<Element> | ObjectOption<Element, any>;


    constructor(option: ElementOption<Element>) {
        Object.assign(this, option);
    }

    public static option(option: ElementOption, type: LiteralInString | 'object') {
        if (type === 'string') return option.objectOption;
        if (type === 'number') return option.objectOption;
        if (type === 'boolean') return option.booleanOption;
        if (type === 'undefined') return option.objectOption;
        if (type === 'null') return option.objectOption;
        if (type === 'object') return option.objectOption;

        ElementOption.assertNever(type);
    }

    static assertNever(type: never): never {
        throw new Error('Unexpected type: ' + type);
    }
}

export type XorElementOption<Element = any> =
    LiteralElementOption<LiteralType, LiteralInString> | ListOption<Element> | ObjectOption<Element, any>;
