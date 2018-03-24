import { LiteralType, KeyType } from './definition';


export interface Returnable {
    push(key: KeyType, arg: any): void;
    value(): Array<any> | {};
}

export class ArrayReturnable implements Returnable {
    private container = [];

    push(key: KeyType, elmt: any) {
        this.container.push(elmt);
    }

    value() {
        return this.container;
    }
}


export class ObjectReturnable implements Returnable {
    private container = {};

    push(key: KeyType, elmt: any) {
        this.container[key] = elmt;
    }


    value() {
        return this.container;
    }
}



export class LiteralReturnable implements Returnable {
    private container: LiteralType;

    push(key: KeyType, elmt: LiteralType) {
        this.container = elmt;
    }

    value() {
        return this.container;
    }
}
