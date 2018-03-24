import { PropertyOption } from './property';
import { ListOption } from './list';
import { PlainObject, Function2 } from './definition';
import { Parse } from './parse';
import { Returnable, ObjectReturnable } from './returnable';
import { triggerAsyncId } from 'async_hooks';
import { RequiredIf } from './decorator/required';

export class ObjectOption<ListElmt = any, ReturnVisitor = any> {
    returnObject?: Returnable;
    filter?: Function2<string, ListElmt, boolean>;
    mutate?: Function2<string, ListElmt, ReturnVisitor>;
    option?: Function2<ListElmt, number, PropertyOption<ListElmt, ReturnVisitor>>;
    @RequiredIf(function () { return this.all !== undefined; }) properties: Array<PropertyOption<ListElmt, ReturnVisitor>>;
    @RequiredIf(function () { return this.properties !== undefined; }) all?: boolean;


    constructor(option: ObjectOption) {
        this.returnObject = option.returnObject || new ObjectReturnable();
        this.filter = option.filter || ((key: string, value: any) => true);
        this.option = option.option;
        this.properties = option.properties;
        this.all = option.all || false;
    }
}


export class OBject {

    constructor(private option: ObjectOption) { }

    public parse(object: PlainObject<any>) {
        if (this.option.all)
            this.parseAll(object);
        else
            this.parseProperties(object);

        return this.option.returnObject;
    }


    private parseProperties(object: PlainObject<any>) {
        for (const prop of this.option.properties) {
            if (object[prop.name] !== undefined)
                this.processElement(prop.name, object[prop.name]);
        }
    }

    private parseAll(object: PlainObject<any>) {
        for (const [key, value] of Object.entries(object))
            this.processElement(key, value);
    }



    private processElement(key: string, value: any) {
        if (this.option.filter(key, value)) {
            const processedValue = this.process(key, value);
            const visitedValue = this.option.mutate(key, processedValue);
            this.option.returnObject.push(visitedValue);

            return visitedValue;
        }
    }


    private process(propName: string, value: any) {
        if (typeof value === 'object') {

            if (this.option.all)
                return Parse.parseNext(value, { all: true });


            const elmtOption = this.option.option(propName, value);
            if (elmtOption)
                return Parse.parseNext(value, elmtOption);


            const prop = this.option.properties[propName];
            if (prop !== undefined) {
                if (prop.all)
                    return Parse.parseNext(value, { all: true });

                return Parse.parseNext(value, prop.property);
            }

            console.warn(`Object with name ${propName} doesn't have any option. Default mode -> option.all = true (recursively)`);
            return Parse.parseNext(value, { all: true });
        }

        return value;
    }
}
