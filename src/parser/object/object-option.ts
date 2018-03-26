import { Option, OptionProperties } from '../option';
import { ObjectReturnable } from '../returnable';
import { isBoolean } from 'util';

export type MembersOptionProperties = { [key: string]: OptionProperties | boolean };

export interface ObjectOptionProperties extends OptionProperties {
    elementOption?: MembersOptionProperties | boolean;
    properties?: MembersOptionProperties | boolean;

}


export class ObjectOption extends Option {
    constructor(option: ObjectOptionProperties | boolean) {
        if (isBoolean(option))
            super({ all: true });
        else
            super(option);


        if (this._returnObject === undefined)
            this._returnObject = new ObjectReturnable();
    }



    protected getSpecializedOption(key: number | string, json: any): ObjectOptionProperties {
        if (this._elementOption === undefined)
            return undefined;

        return this._elementOption[key] || this._elementOption['string'];
    }

}
