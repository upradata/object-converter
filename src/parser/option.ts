// import { ObjectOption, OBject } from './object';
import { Function2, LiteralType, LiteralInString, Visitor, VisitorRecursive } from './definition';
import { Returnable, ArrayReturnable } from './returnable';
// import { ElementOption, XorElementOption, LiteralElementOption, LiteralElementOptionAny } from './array-element';
import { RequiredIf, ValidateProperties } from '../decorator/required';
import { Validate } from '../decorator/validate';
import { isBoolean } from 'util';


export interface OptionProperties {
    returnObject?: Returnable;
    filter?: Visitor | VisitorRecursive;
    mutate?: Visitor | VisitorRecursive;
    option?: Visitor | VisitorRecursive;
    elementOption?: any; // Option[];
    all?: boolean;
}

/* @RequiredIf(function () { return this.all === undefined; }) elementOption ?: Option;
@RequiredIf(function () { return this.elementOption === undefined; }) all ?: boolean; */

export class Option {
    protected _returnObject: Returnable;
    protected _filter: VisitorRecursive;
    protected _mutate: VisitorRecursive;
    protected _option: VisitorRecursive;
    protected _elementOption?: any; // Option[];
    protected _all: boolean;

    constructor(option: OptionProperties) {
        this._returnObject = option.returnObject;
        this._mutate = new VisitorRecursive(option.mutate || ((index: number, value: any) => value));
        this._filter = new VisitorRecursive(option.filter || ((index: number, value: any) => true));
        this._option = new VisitorRecursive(option.option);
        this._elementOption = option.elementOption;


        if (isBoolean(this._elementOption))
            this._all = this._elementOption;


        this._all = option.all;

        if (option.all === undefined && this._elementOption === undefined) {
            // console.warn(`element doesn't have any option. Default mode -> option.all = true (recursively)`);
            this._all = true;
        }

    }


    public getOption(key: number | string, json: any): OptionProperties {

        if (this._option.visitor !== undefined)
            return this._option.visitor(key, json);

        const option = this.getSpecializedOption(key, json);
        if (option !== undefined)
            return this.plugRecursive(option);

        if (this._elementOption !== undefined)
            return this._elementOption;

        if (this._all)
            return this.plugRecursive({ all: true });

        throw new Error('Impossible');
    }


    private plugRecursive(option: OptionProperties): OptionProperties {
        for (const prop of ['mutate', 'option', 'filter']) {

            if (this['_' + prop].recursive && option[prop] === undefined) {
                option[prop] = {
                    visitor: this['_' + prop].visitor,
                    recursive: true
                };
            }
        }

        return option;
    }


    protected getSpecializedOption(key: number | string, json: any): OptionProperties {
        return undefined;
    }



    // getters

    get filter() { return this._filter.visitor; }
    get mutate() { return this._mutate.visitor; }
    get option() { return this._option.visitor; }
    get returnObject() { return this._returnObject; }
    get elementOption() { return this._elementOption; }
    get all() { return this._all; }
}
