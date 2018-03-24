import { Option, OptionProperties } from '../option';
import { LiteralReturnable } from '../returnable';
import { isBoolean } from 'util';
import { zalgo } from 'colors/safe';


export interface LiteralOptionProperties extends OptionProperties {
    elementOption?: { [key: string]: OptionProperties } | boolean;
}


export class LiteralOption extends Option {
    constructor(option: LiteralOptionProperties | boolean) {
        if (isBoolean(option))
            super({ all: true });
        else
            super(option);

        if (this._option.returnObject === undefined)
            this._option.returnObject = new LiteralReturnable();
    }



    protected getSpecializedOption(key: number | string, json: any): LiteralOptionProperties {
        return this.elementOption;
    }

}
