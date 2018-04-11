import { Element, IteratorElement } from '../element';
import { ObjectOption } from './object-option';

export class ObjectElement extends Element {
    private index = -1;

    constructor(json: {}, option: ObjectOption, level: number) {
        super(json, option, level);
    }



    public next(): IteratorResult<IteratorElement> {
        let keys: string[];

        if (this.option.all)
            keys = Object.getOwnPropertyNames(this.json);
        else
            keys = Object.getOwnPropertyNames(this.option.elementOption).filter(key => this.json[key] !== undefined);


        ++this.index;

        if (this.index < keys.length) {
            const key = keys[this.index];

            return {
                done: false,
                value: [key, this.json[key], this.index === keys.length - 1]
            };
        }

        return { done: true, value: null };


        /*  if (this.option.all)
             return this.nextAll();
 
         return this.nextPartial(); */
    }



    /*
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
           // if (this.json[key] !== undefined) {
                yield [key, this.json[key], ++index === keys.length];
          //  }
        }
    }
    */

}
