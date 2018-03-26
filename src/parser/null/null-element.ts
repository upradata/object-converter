import { Element, IteratorElement } from '../element';
import { Option } from '../option';

export class NullElement extends Element {

    constructor() {
        super(undefined, undefined, undefined);
    }

}
