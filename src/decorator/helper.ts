import { ClassType } from './definition';
import * as colors from 'colors/safe';

type KeyType = { toString(): string };

function recreateString(strings: TemplateStringsArray, ...keys: KeyType[]) {
    const parameters = keys;

    if (keys[keys.length - 1] !== '') {
        // we are not in the case `bla bla bla${0}` ==> ${abc} at the end
        parameters.push('');
    }

    let res = '';

    for (let i = 0; i < strings.length; ++i) {
        res += strings[i] + parameters[i];
    }

    return res;
}


function generateTag(format: (arg: string) => string, strings: TemplateStringsArray, ...keys: KeyType[]) {
    const newKeys: string[] = [];

    for (const key of keys)
        newKeys.push(format(key.toString()));


    return recreateString(strings, ...newKeys);
}


export function bold(strings: TemplateStringsArray, ...keys: KeyType[]) {
    return generateTag(colors.bold, strings, ...keys);
}

export function green(strings: TemplateStringsArray, ...keys: KeyType[]) {
    return generateTag(colors.green, strings, ...keys);
}

export function highlight(strings: TemplateStringsArray, ...keys: KeyType[]) {
    return generateTag((s: string) => {
        let newString = s;
        newString = colors.bold(s);
        newString = colors.yellow(newString);

        return newString;
    }, strings, ...keys);
}


export function methodArgs(method: Function | ClassType) {
    let args: string;

    // First match everything inside the method argument parens.
    if (method.prototype) {
        const constructorRegexp = /constructor\s*\(([^)]*)\)/;
        args = method.toString().match(constructorRegexp)[1];
    } else {
        const methodRegexp = /(\*?\[Symbol\.)?[a-z$][\w\d]+\]?\s*\(([^)]*)\)/;
        args = method.toString().match(methodRegexp)[2];
    }

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}
