import { Element, IteratorElement } from '../element';
import { ArrayOption } from './array-option';

export class ArrayElement extends Element {

    constructor(json: any[], option: ArrayOption, level: number) {
        super(json, option, level);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {

        for (const index of (<any[]>this.json).keys()) {
            yield [index, this.json[index], index === this.json.length - 1];

        }
    }

}
