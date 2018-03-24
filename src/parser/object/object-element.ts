import { Element, IteratorElement } from '../element';
import { ObjectOption } from './object-option';

export class ObjectElement extends Element {

    constructor(json: {}, option: ObjectOption) {
        super(json, option);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
        if (this.option.all)
            yield* this.iteratortAll();
        else
            yield* this.iteratorPartial();
    }


    private *iteratortAll(): IterableIterator<IteratorElement> {
        for (const [key, elmt] of Object.entries(this.json))
            yield [key, elmt, false];

    }


    private *iteratorPartial(): IterableIterator<IteratorElement> {
        for (const key of Object.keys(this.option.elementOption)) {

            if (this.json[key] !== undefined) // security
                yield [key, this.json[key], false];

        }
    }
}
