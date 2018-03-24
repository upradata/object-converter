import { Element, IteratorElement } from '../element';
import { LiteralType } from '../definition';
import { LiteralOption } from './literal-option';


export class LiteralElement extends Element {

    constructor(json: LiteralType, option: LiteralOption) {
        super(json, option);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
        let key: string = typeof this.json;

        if (key === 'object')
            key = 'null';


        yield [key, this.json, true];
    }

}
