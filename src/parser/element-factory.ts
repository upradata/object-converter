import { LiteralElement } from './litral/literal-element';
import { ArrayElement } from './array/array-element';
import { ObjectElement } from './object/object-element';
import { NullElement } from './null/null-element';


// option
import { OptionProperties } from './option';
import { ArrayOption } from './array/array-option';
import { ObjectOption } from './object/object-option';
import { LiteralOption } from './litral/literal-option';


import * as check from 'is-check';


export class ElementFactory {

    static create(json: any, optionProperties: OptionProperties | boolean, level = 0) {

        if (check.isNumber(json) ||
            check.isString(json) ||
            check.isBoolean(json) ||
            check.isUndefined(json) ||
            check.isNull(json)) {

            return new LiteralElement(json, new LiteralOption(optionProperties), level);
        }


        if (check.isArray(json)) {
            return new ArrayElement(json, new ArrayOption(optionProperties), level);
        }

        if (check.isObject(json)) {
            return new ObjectElement(json, new ObjectOption(optionProperties), level);
        }

        throw new Error('Unexpected element');
    }
}
