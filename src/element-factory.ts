import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@upradata/util';
import { ArrayElement } from './array';
import { LiteralElement } from './literal';
import { ObjectElement } from './object';
import { Options, ConvertOptions } from './options';
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

    static create(value: unknown, options: Options /* | boolean */, level = 0) {
        switch (typeOf(value)) {
            case 'literal': return new LiteralElement(value as Literal, options, level);
            case 'array': return new ArrayElement(value as unknown[], options, level);
            case 'object': return new ObjectElement(value, options, level);
            default:
        }
    }
}


// U = T is a little trick to bypass a bug. We want U being the type of "value"
// and not the opposite.
export const convert = <T, U = T>(value: T, options?: ConvertOptions<U>) => {
    return ElementFactory.create(value, {
        ...options,
        parent: {
            key: null,
            value,
            levelDetails: { level: -1, isLast: false, isLeaf: false }
        }
    }).convert();
};
