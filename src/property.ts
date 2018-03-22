import { Function2 } from './definition';
import { ListOption } from './list';
import { ObjectOption } from './object';
import { Parse } from './parse';
import { Returnable } from './returnable';

export class PropertyOption<ValueType = any, ReturnVisitor = any> {
    name: string;
    mutate?: Function2<string, ValueType, ReturnVisitor>;
    property?: ListOption<ValueType> | ObjectOption<ValueType>;
    all?: boolean;

    constructor(option: PropertyOption) {
        this.name = option.name;
        this.mutate = option.mutate || ((name: string, value: any) => value);
        this.property = option.property;
        this.all = option.all;
    }

}

export class Property {

    constructor(private option: PropertyOption) { }

    public processElement(value: any) {
        if (typeof value === 'object') {
            let propertyParsed: Returnable;

            if (this.option.all)
                propertyParsed = Parse.parseNext(value, { all: true });
            else if (this.option.property !== undefined) {
                propertyParsed = Parse.parseNext(value, this.option.property);
            } else {
                console.warn(`Object with name ${this.option.name} doesn't have any option. Default mode -> option.all = true (recursively)`);
                propertyParsed = Parse.parseNext(value, { all: true });
            }

            return this.option.mutate(this.option.name, propertyParsed);
        }

        return this.option.mutate(this.option.name, value);
    }

}
