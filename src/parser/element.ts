import { Option, OptionProperties } from './option';
// import { isArray, isObject, isNumber, isString, isBoolean, isUndefined, isNull } from 'util';
import { KeyType } from './definition';
import { ElementFactory } from './element-factory';
import { NullElement } from './null/null-element';

// tslint:disable:import-name
// not es5 compatible :(
/* import LiteralElement = require('./litral/literal-element');
import ArrayElement = require('./array/array-element');
import ObjectElement = require('./object/object-element');
import NullElement = require('./null/null-element'); */






export type IteratorElement = [
    /* key */ KeyType,
    /* jsonElement */ any,
    boolean
];



export abstract class Element implements Iterator<IteratorElement> /*implements IterableIterator<IteratorElement>*/ {
    static lazyElementFactory() {
        return require('./element-factory').ElementFactory;
    }
    /* static lazyLoading() {
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
    } */


    constructor(protected json: any, protected option: Option, protected level: number) { }

    /* static create(json: any, optionProperties: OptionProperties | boolean): Element {
        const lazyLoading = Element.lazyLoading();

        if (check.isNumber(json) ||
            check.isString(json) ||
            check.isBoolean(json) ||
            check.isUndefined(json) ||
            check.isNull(json)) {

            return new lazyLoading.LiteralElement(json, new LiteralOption(optionProperties), 0);
        }


        if (check.isArray(json)) {
            return new lazyLoading.ArrayElement(json, new ArrayOption(optionProperties), 0);
        }

        if (check.isObject(json)) {
            return new lazyLoading.ObjectElement(json, new ObjectOption(optionProperties), 0);
        }
    } */



    public parse(): any {
        // for (const [key, json, done] of this) {
        for (let iterator = this.next(); !iterator.done; iterator = this.next()) {
            const [key, json, last] = iterator.value;

            if (this.option.filter(key, json, this.level, last)) {
                const processedElmt = this.parseNext(key, json, last);
                const visitedElmt = this.option.mutate(key, processedElmt, this.level, last);
                this.option.returnObject.push(key, visitedElmt, this.level, last);
            }
        }


        return this.option.returnObject.value();
    }




    private parseNext(key: KeyType, json: any, done: boolean) {
        // End of recursive loop
        if (json instanceof NullElement)
            return key;

        return ElementFactory.create(
            json,
            this.option.getOption(key, json, this.level, done),
            this.level + 1).parse();
    }


    // not es5 compatible :(
    /*  public *[Symbol.iterator](): IterableIterator<IteratorElement> {
         return undefined;
     } */

    // for of loop
    public abstract next(): IteratorResult<IteratorElement>;

    /*  public [Symbol.iterator](): IterableIterator<IteratorElement> {
         return this;
     } */
}
