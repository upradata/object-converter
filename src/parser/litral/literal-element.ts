import { Element, IteratorElement } from '../element';
import { LiteralType } from '../definition';
import { LiteralOption } from './literal-option';
import { NullElement } from '../null/null-element';

export class LiteralElement extends Element {
    private done = false;

    constructor(json: LiteralType, option: LiteralOption, level: number) {
        super(json, option, level);
    }


    public next(): IteratorResult<IteratorElement> {
        if (!this.done) {
            this.done = true;

            return {
                done: false,
                value: [this.json, new NullElement(), true]
            };

        }

        return {
            done: true,
            value: null
        };
    }

    /* impossible for es5 compatibility :(
 
    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
       //  let key: string = typeof this.json;
 
       // if (key === 'object')
       //     key = 'null';
        
    yield [this.json, new NullElement(), true];
    } */
}
