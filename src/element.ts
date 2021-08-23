import { Key, RecursiveProp, TransformerDetails } from './types';
import type { ElementFactory } from './element-factory';
import { ElementOptions } from './element-options';
import { BaseOpts } from './options';


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

            const { filter, mutate, next, options } = this.options.getOptions(key, value, details);

            if (filter.value(key, value, details)) {

                const mutatedValue = mutate.value(key, value, details);

                const parsedValue = this.parseNext(
                    mutatedValue,
                    { ...next, ...(options?.recursive ? options as RecursiveProp<BaseOpts> : {}) },
                    details
                );

                returnable.push(key, parsedValue, details);
            }
        }


        return returnable.value();
    }




    private parseNext(value: unknown, nextOptions: RecursiveProp<BaseOpts>, details: TransformerDetails) {
        // End of recursive loop
        if (details.isLeaf)
            return value;

        return Element.lazyElementFactory().create(
            value,
            this.options.getNextOptions(nextOptions), // this.options.getOptions(key, value, details),
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
