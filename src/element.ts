import { Key, TransformerDetails } from './types';
import type { ElementFactory } from './element-factory';
import { ElementOptions } from './element-options';


export interface IteratorElement {
    key: Key;
    value: unknown;
    isLast: boolean;
    isLeaf: boolean;
}



export abstract class Element implements Iterator<IteratorElement>  {
    static lazyElementFactory() {
        // eslint-disable-next-line global-require
        return require('./element-factory').ElementFactory as typeof ElementFactory;
    }


    constructor(protected value: unknown, public options: ElementOptions, protected level: number) { }

    public convert(): unknown {
        const { returnable } = this.options;

        for (let iterator = this.next(); !iterator.done; iterator = this.next()) {
            const { key, value, isLast, isLeaf } = iterator.value;
            const details = { level: this.level, isLast, isLeaf };

            const { filter, mutate } = this.options.getOptions(key, value, details);

            if (filter.transform(key, value, details)) {
                const parsedElmt = this.parseNext(key, value, details);
                const visitedElmt = mutate.transform(key, parsedElmt, details);
                returnable.push(key, visitedElmt, details);
            }
        }


        return returnable.value();
    }




    private parseNext(key: Key, value: unknown, details: TransformerDetails) {
        // End of recursive loop
        if (details.isLeaf)
            return value;

        return Element.lazyElementFactory().create(
            value,
            this.options.getNextOptions(), // this.options.getOptions(key, value, details),
            this.level + 1).convert();
    }


    // not es5 compatible :(

    /*  public *[Symbol.iterator](): IterableIterator<IteratorElement> {
         return undefined;
     }
     public [Symbol.iterator](): IterableIterator<IteratorElement> {
         return this;
     }
     */


    // for of loop
    public abstract next(): IteratorResult<IteratorElement, null>;
}
