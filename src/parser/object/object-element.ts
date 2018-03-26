import { Element, IteratorElement } from '../element';
import { ObjectOption } from './object-option';

export class ObjectElement extends Element {

    constructor(json: {}, option: ObjectOption, level: number) {
        super(json, option, level);
    }


    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
        if (this.option.all)
            yield* this.iteratortAll();
        else
            yield* this.iteratorPartial();
    }


    private *iteratortAll(): IterableIterator<IteratorElement> {
        const entries = Object.entries(this.json);
        let index = 0;

        for (const [key, elmt] of entries)
            yield [key, elmt, ++index === entries.length];

    }


    private *iteratorPartial(): IterableIterator<IteratorElement> {
        const keys = Object.keys(this.option.elementOption).filter(key => this.json[key] !== undefined);
        let index = 0;

        for (const key of keys) {
            if (this.json[key] !== undefined) {
                yield [key, this.json[key], ++index === keys.length];
            }
        }
    }


}
