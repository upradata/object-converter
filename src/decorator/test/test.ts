import { Required, RequiredIf, Validate } from '../required';


@Validate
class Greeter {
    greeting: string;
    @RequiredIf(function () { return this.p2 === undefined; }) p1: string;
    @RequiredIf(function () { return this.p1 === undefined; }) p2: boolean;
    @RequiredIf(function () { return this.p1 === 'caca' && this.p2 === true; }) p3: number;

    constructor(dummy: number, @Required message?: string) {
        this.greeting = message;
        this.p2 = true;
        this.p1 = 'caca';
        this.p3 = 2;
    }

    @Validate
    greet(dummy: number, @Required name?: string) {
        return 'Hello ' + name + ', ' + this.greeting;
    }
}

const g = new Greeter(1, 'caca');
console.log(g.greet(1, 'thomas'));

try {
    console.log(g.greet(1));
} catch (e) {
    console.log(e.message);
}

try {
    const g2 = new Greeter(1);
} catch (e) {
    console.log(e.message);
}
