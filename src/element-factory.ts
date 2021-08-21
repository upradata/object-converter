import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@upradata/util';
import { ArrayElement } from './array';
import { ConvertOptions } from './convert.types';
import { LiteralElement } from './literal';
import { ObjectElement } from './object';
import { Options } from './options.types';
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

    static create(value: unknown, optionsProperties: Options | boolean, level = 0) {
        switch (typeOf(value)) {
            case 'literal': return new LiteralElement(value as Literal, optionsProperties, level);
            case 'array': return new ArrayElement(value as unknown[], optionsProperties, level);
            case 'object': return new ObjectElement(value, optionsProperties, level);
            default:
        }
    }
}


export const convert = <T>(value: T, optionsProperties?: ConvertOptions<T>) => {
    return ElementFactory.create(value, optionsProperties).convert();
};
