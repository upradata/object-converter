import { isArray } from './help';
import { ListOption, List } from './list';
import { ObjectOption, OBject } from './object';

export class Parse {
    /*  private json: {};
     private option: ListOption | ObjectOption; */

    constructor(private json: {}, private option: ListOption | ObjectOption) { }

    public parse() {
        return Parse.parseNext(this.json, this.option);
    }


    public static parseNext(value: any, option: ListOption | ObjectOption) {
        if (isArray(value))
            return new List(option as ListOption).parse(value);

        return new OBject(option as ObjectOption).parse(value);
    }

}
