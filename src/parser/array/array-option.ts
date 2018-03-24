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


        if (this._option.returnObject === undefined)
            this._option.returnObject = new ArrayReturnable();
    }


    protected getSpecializedOption(key: number | string, json: any): ArrayOptionProperties {
        if (this.elementOption === undefined)
            return undefined;

        let typeOf: string = typeof json;
        if (typeOf === 'object' && json === null)
            typeOf = 'null';


        return this.elementOption[typeOf] || this.elementOption;
    }
}
