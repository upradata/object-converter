import { ObjectOf } from '@upradata/util';
import { Transformer, Key, Literal } from './types';


export interface Returnable<T = unknown> {
    push: Transformer;
    value(): T;
}


export type ReturnableConstructor = new (...args: any[]) => Returnable;


export class ArrayReturnable implements Returnable<unknown[]> {
    private container: unknown[] = [];

    push(key: Key, elmt: unknown[]) {
        this.container.push(elmt);
    }

    value() {
        return this.container;
    }
}


export class ObjectReturnable implements Returnable<ObjectOf<unknown>> {
    private container: ObjectOf<unknown> = {};

    push(key: Key, elmt: ObjectOf<any>) {
        this.container[ key ] = elmt;
    }


    value() {
        return this.container;
    }
}



export class LiteralReturnable implements Returnable<Literal> {
    private container: Literal;

    push(_key: Key, elmt: Literal) {
        this.container = elmt;
    }

    value() {
        return this.container;
    }
}
