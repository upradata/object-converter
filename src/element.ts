export class Element {
    option: ElementOption;

}

export type ElementType =
    LiteralElementOption<LiteralType, LiteralInString> | ListOption<Element> | ObjectOption<Element, any>;
