import { Element, IteratorElement } from '../element';
import { LiteralType } from '../definition';
import { LiteralOption } from './literal-option';
import { NullElement } from '../null/null-element';

export class LiteralElement extends Element {

    constructor(json: LiteralType, option: LiteralOption, level: number) {
        super(json, option, level);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
        /* let key: string = typeof this.json;

        if (key === 'object')
            key = 'null';
        */

        yield [this.json, new NullElement(), true];
    }

}
