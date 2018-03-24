import { ObjectOption, OBject } from './object';
import { Function2, LiteralType, LiteralInString } from './definition';
import { Parse } from './parse';
import { Returnable, ArrayReturnable } from './returnable';
import { ElementOption, XorElementOption, LiteralElementOption, LiteralElementOptionAny } from './array-element';
import { RequiredIf, ValidateProperties } from './decorator/required';
import { Validate } from './decorator/validate';


// type ElementOption<ListElmt> = ListOption<ListElmt> | ObjectOption<ListElmt, any> | LiteralElementOption<Literal>;

@ValidateProperties
export class CollectionOption<ListElmt = any, ReturnMutate = ListElmt> {
    returnObject?: Returnable;
    filter?: Function2<ListElmt, number, boolean>;
    mutate?: Function2<ListElmt, number, ReturnMutate>;
    option?: Function2<ListElmt, number, XorElementOption<ListElmt>>;
    @RequiredIf(function () { return this.all === undefined; }) element?: ElementOption<ListElmt>;
    @RequiredIf(function () { return this.element === undefined; }) all?: boolean;

    constructor(option: CollectionOption<ListElmt, ReturnMutate>) {
        this.returnObject = option.returnObject || new ArrayReturnable();
        this.mutate = option.mutate || ((value: any, index: number) => value);
        this.filter = option.filter || ((value: any, index: number) => true);
        this.option = option.option;
        this.element = option.element;
        this.all = option.all || false;
    }
}


export class Collection {

    constructor(private option: CollectionOption) { }


    public parse(list: Array<any>) {
        for (let i = 0; i < list.length; ++i) {
            if (this.option.filter(list[i], i)) {
                const processedElmt = this.processElement(list[i], i);
                const visitedElmt = this.option.mutate(processedElmt, i);
                this.option.returnObject.push(visitedElmt);
            }
        }

        return this.option.returnObject;
    }


    private processElement(elmt: any, index: number) {
        if (typeof elmt === 'object') {
            if (elmt === null) {
                return this.processLiteralElement(index, elmt, 'null');
            }

            let elmtOption: XorElementOption;

            if (this.option.option !== undefined)
                elmtOption = this.option.option(elmt, index);
            else if (this.option.element !== undefined)
                elmtOption = ElementOption.option(this.option.element, 'object');
            if (this.option.all)
                elmtOption = { all: true };
            else {
                console.warn(`Array element doesn't have any option. Default mode -> option.element = true (recursively)`);
                elmtOption = { all: true };
            }

            return Parse.parseNext(elmt, elmtOption);

        }

        // we can't have 'function', 'symbol'
        return this.processLiteralElement(index, elmt, typeof elmt as LiteralInString);
    }


    private processLiteralElement(index: number, elmt: LiteralType, type: LiteralInString) {

        let elmtOption: LiteralElementOptionAny;


        if (this.option.option !== undefined)
            elmtOption = this.option.option(elmt, index) as LiteralElementOptionAny;
        else if (this.option.element) {
            // it's impossible to have 'function' and 'symbol'
            elmtOption = ElementOption.option(this.option.element, typeof elmt as LiteralInString) as LiteralElementOptionAny;
        } else if (this.option.all)
            return elmt;


        return elmtOption.mutate(index, elmt);
    }


}
