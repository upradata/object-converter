import { Option, OptionProperties } from './option';
import { Returnable } from './returnable';
import { isArray, isObject, isNumber, isString, isBoolean, isUndefined, isNull } from 'util';
import { KeyType } from './definition';

// tslint:disable:import-name
import LiteralElement = require('./litral/literal-element');
import ArrayElement = require('./array/array-element');
import ObjectElement = require('./object/object-element');

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


        return {
            LiteralElement: _LiteralElement,
            ArrayElement: _ArrayElement,
            ObjectElement: _ObjectElement
        };
    }


    constructor(protected json: any, protected option: Option) { }

    static create(json: any, optionProperties: OptionProperties | boolean): Element {
        const lazyLoading = Element.lazyLoading();

        if (isNumber(json) ||
            isString(json) ||
            isBoolean(json) ||
            isUndefined(json) ||
            isNull(json)) {

            return new lazyLoading.LiteralElement(json, new LiteralOption(optionProperties));
        }


        if (isArray(json)) {
            return new lazyLoading.ArrayElement(json, new ArrayOption(optionProperties));
        }

        if (isObject(json)) {
            return new lazyLoading.ObjectElement(json, new ObjectOption(optionProperties));
        }
    }



    public parse(): any {
        for (const [key, json, done] of this) {
            if (this.option.filter(key, json)) {
                const processedElmt = done ? json : this.parseNext(key, json);
                const visitedElmt = this.option.mutate(key, processedElmt);
                this.option.returnObject.push(key, visitedElmt);
            }
        }

        return this.option.returnObject.value();
    }




    private parseNext(key: KeyType, json: any) {
        const lazyLoading = Element.lazyLoading();

        if (isNumber(json) ||
            isString(json) ||
            isBoolean(json) ||
            isUndefined(json) ||
            isNull(json)) {

            return new lazyLoading.LiteralElement(json, new LiteralOption(this.option.getOption(key, json))).parse();
        }


        if (isArray(json)) {
            return new lazyLoading.ArrayElement(json, new ArrayOption(this.option.getOption(key, json))).parse();
        }

        if (isObject(json)) {
            return new lazyLoading.ObjectElement(json, new ObjectOption(this.option.getOption(key, json))).parse();
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
