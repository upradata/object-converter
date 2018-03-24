// import { ObjectOption, OBject } from './object';
import { Function2, LiteralType, LiteralInString, Visitor } from './definition';
import { Returnable, ArrayReturnable } from './returnable';
// import { ElementOption, XorElementOption, LiteralElementOption, LiteralElementOptionAny } from './array-element';
import { RequiredIf, ValidateProperties } from '../decorator/required';
import { Validate } from '../decorator/validate';
import { isBoolean } from 'util';


export interface OptionProperties {
    returnObject?: Returnable;
    filter?: Visitor;
    mutate?: Visitor;
    option?: Visitor;
    elementOption?: any; // Option[];
    all?: boolean;
}

/* @RequiredIf(function () { return this.all === undefined; }) elementOption ?: Option;
@RequiredIf(function () { return this.elementOption === undefined; }) all ?: boolean; */

export class Option {
    protected _option: OptionProperties = {} as OptionProperties;

    constructor(option: OptionProperties) {
        this._option.returnObject = option.returnObject;
        this._option.mutate = option.mutate || ((index: number, value: any) => value);
        this._option.filter = option.filter || ((index: number, value: any) => true);
        this._option.option = option.option;
        this._option.elementOption = option.elementOption;


        if (isBoolean(this.elementOption))
            this._option.all = this.elementOption;


        this._option.all = option.all;

        if (option.all === undefined && this.elementOption === undefined) {
            // console.warn(`element doesn't have any option. Default mode -> option.all = true (recursively)`);
            this._option.all = true;
        }

    }


    public getOption(key: number | string, json: any): OptionProperties {

        if (this._option.option !== undefined)
            return this._option.option(key, json);

        const option = this.getSpecializedOption(key, json);
        if (option !== undefined)
            return option;

        if (this._option.elementOption !== undefined)
            return this._option.elementOption;

        if (this._option.all)
            return new Option({ all: true });

        throw new Error('Impossible');
    }


    protected getSpecializedOption(key: number | string, json: any): OptionProperties {
        return undefined;
    }


    // getters

    get returnObject() { return this._option.returnObject; }
    get filter() { return this._option.filter; }
    get mutate() { return this._option.mutate; }
    get elementOption() { return this._option.elementOption; }
    get all() { return this._option.all; }

    // get getOption() { return this.option.getOption; }
}
