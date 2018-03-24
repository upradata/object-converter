import { Element, IteratorElement } from '../element';
import { ArrayOption } from './array-option';

export class ArrayElement extends Element {

    constructor(json: any[], option: ArrayOption) {
        super(json, option);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {

        for (const [index, elmt] of (<any[]>this.json).entries())
            yield [index, elmt, false];
    }

}
