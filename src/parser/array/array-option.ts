import { Option, OptionProperties } from '../option';
import { LiteralInString, Literal } from '../definition';
import { ArrayReturnable } from '../returnable';


export interface ArrayOptionProperties extends OptionProperties {
    elementOption?: {[K in keyof Literal]?: OptionProperties} & { object?: OptionProperties } | OptionProperties | boolean;
    object?: ArrayOptionProperties['elementOption'];
    array?: ArrayOptionProperties['elementOption'];
}


export class ArrayOption extends Option {
    constructor(option: ArrayOptionProperties | boolean) {
        if (typeof option === 'boolean')
            super({ all: true });
        else
            super(option);


        if (this._returnObject === undefined)
            this._returnObject = new ArrayReturnable();
    }


    protected getSpecializedOption(key: number | string, json: any): ArrayOptionProperties {
        if (this._elementOption === undefined)
            return undefined;

        let typeOf: string = typeof json;
        if (typeOf === 'object' && json === null)
            typeOf = 'null';


        return this._elementOption[typeOf] || this._elementOption;
    }
}
