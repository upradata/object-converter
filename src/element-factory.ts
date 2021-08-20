import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@upradata/util';
import { ArrayElement } from './array';
import { LiteralElement } from './literal';
import { ObjectElement } from './object';
import { ConvertOptions } from './options.types';
import { Literal } from './types';


const typeOf = (value: unknown) => {
    if (isNumber(value) ||
        isString(value) ||
        isBoolean(value) ||
        isUndefined(value) ||
        isNull(value)) {

        return 'literal';
    }


    if (isArray(value))
        return 'array';

    // if (isObject(value))
    return 'object';
};

export class ElementFactory {

    static create(value: unknown, optionsProperties: ConvertOptions | boolean, level = 0) {
        switch (typeOf(value)) {
            case 'literal': return new LiteralElement(value as Literal, optionsProperties, level);
            case 'array': return new ArrayElement(value as unknown[], optionsProperties, level);
            case 'object': return new ObjectElement(value, optionsProperties, level);
            default:
        }
    }
}


export const convert = (value: unknown, optionsProperties?: ConvertOptions | boolean) => {
    return ElementFactory.create(value, optionsProperties).convert();
};
