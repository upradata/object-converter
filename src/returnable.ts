
export interface Returnable {
    push(arg: any): void;
    value(): Array<any> | {};
}

export class ArrayReturnable implements Returnable {
    private container = [];

    push(elmt: any) {
        this.container.push(elmt);
    }

    value() {
        return this.container;
    }
}


export class ObjectReturnable implements Returnable {
    private container = {};

    push(elmt: { key: string, value: any }) {
        this.container[elmt.key] = elmt.value;
    }

    value() {
        return this.container;
    }
}
