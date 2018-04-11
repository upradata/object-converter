import { Element, IteratorElement } from '../element';
import { ArrayOption } from './array-option';

export class ArrayElement extends Element {
    private index = -1;


    constructor(json: any[], option: ArrayOption, level: number) {
        super(json, option, level);
    }


    public next(): IteratorResult<IteratorElement> {
        ++this.index;

        if (this.index < this.json.length)
            return {
                done: false,
                value: [this.index, this.json[this.index], this.index === this.json.length - 1]
            };

        return { done: true, value: null };
    }


    /* impossible for es5 compatibility :(
    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
 
         for (const index of (<any[]>this.json).keys()) {
            yield [index, this.json[index], index === this.json.length - 1];
 
        }
    }*/

}
