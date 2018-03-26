import { Option, OptionProperties } from '../option';
import { LiteralReturnable } from '../returnable';
import { isBoolean } from 'util';
import { Literal } from '../definition';

export interface LiteralOptionProperties extends OptionProperties {
    elementOption?: {[K in keyof Literal]?: OptionProperties } | OptionProperties | boolean;
}


export class LiteralOption extends Option {
    constructor(option: LiteralOptionProperties | boolean) {
        if (isBoolean(option))
            super({ all: true });
        else
            super(option);

        if (this._returnObject === undefined)
            this._returnObject = new LiteralReturnable();
    }



    protected getSpecializedOption(key: number | string, json: any): LiteralOptionProperties {
        if (this._elementOption === undefined)
            return undefined;

        let typeOf: string = typeof json;
        if (typeOf === 'object' && json === null)
            typeOf = 'null';
        else
            throw new Error('A LiteralElement cannot be an object');

        return this._elementOption[typeOf] || this.elementOption;
    }

}
