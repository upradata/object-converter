import { isNil, ObjectOf } from '@upradata/util';
import { Key, Literal, LevelDetails } from './types';


// export type Push<T = unknown> = (key?: Key, value?: T, details?: LevelDetails) => void;


export const ConcatenatorSymbol = Symbol('Concatenator class');

export abstract class Concatenator<T = unknown, U = T> {
    static [ ConcatenatorSymbol ] = true;
    abstract push(key?: Key, value?: T, details?: LevelDetails): void;
    abstract value(): U;
}


export const isConcatenatorClass = (v: any): v is Concatenator => {
    let klass = v;

    while (!isNil(klass) && klass.constructor.name !== 'Object') {
        if (klass[ ConcatenatorSymbol ])
            return true;

        klass = Object.getPrototypeOf(klass);
    }

    return false;
};

export type ConcatenatorCtor<T = unknown, U = T> = new () => Concatenator<T, U>;


export class ArrayConcatenator extends Concatenator<unknown[]> {

    private container: unknown[] = [];

    push(key: Key, elmt: unknown[]) {
        this.container.push(elmt);
    }

    value() {
        return this.container;
    }
}


export class ObjectConcatenator extends Concatenator<ObjectOf<unknown>> {
    private container: ObjectOf<unknown> = {};

    push(key: Key, elmt: ObjectOf<any>) {
        this.container[ key ] = elmt;
    }


    value() {
        return this.container;
    }
}



export class LiteralConcatenator extends Concatenator<Literal> {
    private container: Literal;

    push(_key: Key, elmt: Literal) {
        this.container = elmt;
    }

    value() {
        return this.container;
    }
}
