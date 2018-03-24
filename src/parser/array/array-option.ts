import { Option, OptionProperties } from '../option';
import { LiteralInString, Literal } from '../definition';
import { ArrayReturnable } from '../returnable';
import { isBoolean } from 'util';



export interface ArrayOptionProperties extends OptionProperties {
    elementOption?: {[K in keyof Literal]?: OptionProperties} & { object?: OptionProperties } | OptionProperties | boolean;
}


export class ArrayOption extends Option {
    constructor(option: ArrayOptionProperties | boolean) {
        if (isBoolean(option))
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
