import { Option, OptionProperties } from './option';
import { isArray, isObject, isNumber, isString, isBoolean, isUndefined, isNull } from 'util';
import { KeyType } from './definition';

// tslint:disable:import-name
import LiteralElement = require('./litral/literal-element');
import ArrayElement = require('./array/array-element');
import ObjectElement = require('./object/object-element');
import NullElement = require('./null/null-element');


// option
import { ArrayOption } from './array/array-option';
import { ObjectOption } from './object/object-option';
import { LiteralOption } from './litral/literal-option';




export type IteratorElement = [
    /* key */ KeyType,
    /* jsonElement */ any,
    boolean
];



export abstract class Element /*implements IterableIterator<IteratorElement>*/ {
    static lazyLoading() {
        const _LiteralElement: typeof LiteralElement.LiteralElement = require('./litral/literal-element').LiteralElement;
        const _ArrayElement: typeof ArrayElement.ArrayElement = require('./array/array-element').ArrayElement;
        const _ObjectElement: typeof ObjectElement.ObjectElement = require('./object/object-element').ObjectElement;
        const _NullElement: typeof NullElement.NullElement = require('./null/null-element').NullElement;


        return {
            LiteralElement: _LiteralElement,
            ArrayElement: _ArrayElement,
            ObjectElement: _ObjectElement,
            NullElement: _NullElement
        };
    }


    constructor(protected json: any, protected option: Option, protected level: number) { }

    static create(json: any, optionProperties: OptionProperties | boolean): Element {
        const lazyLoading = Element.lazyLoading();

        if (isNumber(json) ||
            isString(json) ||
            isBoolean(json) ||
            isUndefined(json) ||
            isNull(json)) {

            return new lazyLoading.LiteralElement(json, new LiteralOption(optionProperties), 0);
        }


        if (isArray(json)) {
            return new lazyLoading.ArrayElement(json, new ArrayOption(optionProperties), 0);
        }

        if (isObject(json)) {
            return new lazyLoading.ObjectElement(json, new ObjectOption(optionProperties), 0);
        }
    }



    public parse(): any {
        for (const [key, json, done] of this) {
            if (this.option.filter(key, json, this.level, done)) {
                const processedElmt = this.parseNext(key, json, done);
                const visitedElmt = this.option.mutate(key, processedElmt, this.level, done);
                this.option.returnObject.push(key, visitedElmt, this.level, done);
            }
        }

        return this.option.returnObject.value();
    }




    private parseNext(key: KeyType, json: any, done: boolean) {
        const lazyLoading = Element.lazyLoading();

        // End of recursive loop
        if (json instanceof lazyLoading.NullElement)
            return key; // key is the literal value


        if (isNumber(json) ||
            isString(json) ||
            isBoolean(json) ||
            isUndefined(json) ||
            isNull(json)) {

            return new lazyLoading.LiteralElement(json,
                new LiteralOption(this.option.getOption(key, json, this.level, done)),
                this.level + 1).parse();
        }


        if (isArray(json)) {
            return new lazyLoading.ArrayElement(json,
                new ArrayOption(this.option.getOption(key, json, this.level, done)),
                this.level + 1).parse();
        }

        if (isObject(json)) {
            return new lazyLoading.ObjectElement(json,
                new ObjectOption(this.option.getOption(key, json, this.level, done)),
                this.level + 1).parse();
        }


        throw new Error('Unexpected element');
    }











    public *[Symbol.iterator](): IterableIterator<IteratorElement> {
        return undefined;
    }

    // for of loop
    // public abstract next(): IteratorResult<IteratorElement>;

    /*  public [Symbol.iterator](): IterableIterator<IteratorElement> {
         return this;
     } */
}
