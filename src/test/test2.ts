import { Element } from '../parser/element';
import { Option, OptionProperties } from '../parser/option';
import * as emojisJson from 'emoji-datasource/emoji.json';

import { ArrayOptionProperties } from '../parser/array/array-option';
import { ObjectOptionProperties, MembersOptionProperties } from '../parser/object/object-option';
import { LiteralOptionProperties, LiteralOption } from '../parser/litral/literal-option';

import * as fs from 'fs-extra';
import * as path from 'path';
import { KeyType, VisitorRecursive } from '../parser/definition';
import { Returnable } from '../parser/returnable';
import { ExecOptions } from 'child_process';


const test = {
    stringify: true,
    few_Few_WithVisitor_And_Aliases: false,
    all_Null_Remover: false,
    all_Null_Remover_Recursive: false,
    few_Few_WithVisitor: false,
    few_Few: false,
    few_All: false,
    all: false,
};




function $writeJson(fileName: string, json: any) {

    return fs.ensureFile(fileName)
        .then(() => fs.writeJson(fileName, json).then(
            () => fileName,
            err => Promise.reject(err)
        ))
        .catch(err => Promise.reject(err));
}


const option = {
    elementOption: {
        elementOption: {
            name: { elementOption: true } as LiteralOptionProperties,
            unified: true,
            sheet_x: true,
            skin_variations: true
        }
    } as ObjectOptionProperties
} as ArrayOptionProperties;


const extractionAll = {
    all: true
};

const extractionFew_All = {
    elementOption: {
        elementOption: {
            name: { elementOption: true } as LiteralOptionProperties,
            unified: true,
            sheet_x: true,
            skin_variations: true
        }
    } as ObjectOptionProperties
} as ArrayOptionProperties;


const extractionFew_Few = {

    elementOption: {

        elementOption: {

            name: true,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,

                elementOption: {

                    string: {

                        elementOption: {
                            unified: true,
                            image: true,
                            sheet_x: true
                        } as MembersOptionProperties

                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;



const jsonDir = path.resolve('json-test');



if (test.all) {
    const all = Element.create(emojisJson, extractionAll).parse();
    console.log(JSON.stringify(all) === JSON.stringify(emojisJson));

    $writeJson(path.join(jsonDir, 'emojis-all.json'), Element.create(emojisJson, extractionAll).parse()).then(
        fileName => console.log(`${fileName} done :)`),
        err => console.error(err)
    );
}


if (test.few_All)
    $writeJson(path.join(jsonDir, 'emojis-few-all.json'), Element.create(emojisJson, extractionFew_All).parse()).then(
        fileName => console.log(`${fileName} done :)`),
        err => console.error(err)
    );


if (test.few_Few)
    $writeJson(path.join(jsonDir, 'emojis-few-few.json'), Element.create(emojisJson, extractionFew_Few).parse()).then(
        fileName => console.log(`${fileName} :)`),
        err => console.error(err)
    );


const a = {
    mutate: (key: string, name: string, level: number) => 'Ta mere LA PUTE : ' + name
} as LiteralOption;

const extractionFew_Few_WithVisitor = {

    elementOption: {

        elementOption: {

            name: {
                mutate: (key: string, name: string, level: number) => 'Ta mere LA PUTE : ' + name
            } as LiteralOptionProperties,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,

                elementOption: {
                    string: {
                        unified: true,
                        image: {
                            mutate: (key: string, image: string, level: number) => 'L IMAGE qui tue : ' + image
                        } as LiteralOption,
                        sheet_x: true
                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;



if (test.few_Few_WithVisitor)
    $writeJson(path.join(jsonDir, 'emoji-few-few-with-visitor.json'), Element.create(emojisJson, extractionFew_Few_WithVisitor).parse()).then(
        fileName => console.log(`${fileName} :)`),
        err => console.error(err)
    );


const extractionFew_Few_WithVisitor_And_Aliases = {

    object: {

        properties: {

            name: {
                mutate: (key: string, name: string, level: number) => 'Ta mere LA PUTE : ' + name
            } as LiteralOptionProperties,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,

                properties: {
                    string: {
                        unified: true,
                        image: {
                            mutate: (key: string, image: string, level: number) => 'L IMAGE qui tue : ' + image
                        } as LiteralOption,
                        sheet_x: true
                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;


if (test.few_Few_WithVisitor_And_Aliases) {
    const noAlias = Element.create(emojisJson, extractionFew_Few_WithVisitor).parse();
    const alias = Element.create(emojisJson, extractionFew_Few_WithVisitor_And_Aliases).parse();

    console.log(JSON.stringify(noAlias) === JSON.stringify(alias));
}




const extractionAll_Null_Remover = {
    all: true,
    filter: (key: string, value: any) => value !== null,

    elementOption: {
        all: true,
        filter: (key: string, value: any) => value !== null,

        elementOption: {
            all: true,
            filter: (key: string, value: any) => value !== null,
            skin_variations: {
                all: true,
                filter: (key: string, value: any) => value !== null,

                elementOption: {
                    string: {
                        all: true,
                        filter: (key: string, value: any) => value !== null
                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;


if (test.all_Null_Remover)
    $writeJson(path.join(jsonDir, 'emojis_all_null_remover.json'), Element.create(emojisJson, extractionAll_Null_Remover).parse()).then(
        fileName => console.log(`${fileName} :)`),
        err => console.error(err)
    );





const extractionAll_Null_Remover_Recursive = {
    all: true,
    filter: {
        visitor: (key: string, value: any) => value !== null,
        recursive: true
    } as VisitorRecursive

} as ArrayOptionProperties;



if (test.all_Null_Remover_Recursive) {
    /*     $writeJson(path.join(jsonDir, 'emojis_all_null_remover_recursive.json'), Element.create(emojisJson, extractionAll_Null_Remover_Recursive).parse()).then(
            fileName => console.log(`${fileName} :)`),
            err => console.error(err)
        );
     */

    const noRecursive = Element.create(emojisJson, extractionAll_Null_Remover).parse();
    const recursive = Element.create(emojisJson, extractionAll_Null_Remover_Recursive).parse();

    console.log(JSON.stringify(noRecursive) === JSON.stringify(recursive));
}



class Indent {
    private _indent: number;

    constructor(indent = 2) {
        this._indent = indent;
    }

    indent(level: number) {
        return ' '.repeat((level) * this._indent);
    }
}

class ArrayToString extends Indent implements Returnable {
    private container = '[\n';

    constructor(indent = 2) {
        super(indent);
    }

    push(key: KeyType, elmt: string | number | undefined | null, level: number, done: boolean) {
        let elt = elmt;
        if (typeof elmt === 'string' && elmt[0] !== '{' && elmt[0] !== '[')
            elt = `"${elt}"`;


        if (done)
            this.container += this.indent(level + 1) + elmt + '\n' + this.indent(level) + ']';
        else
            this.container += this.indent(level + 1) + elmt + ',\n';

    }

    value() {
        return this.container;
    }
}



class ObjectToString extends Indent implements Returnable {
    private container = '{\n';

    constructor(indent = 2) {
        super(indent);
    }

    push(key: KeyType, elmt: string | number | undefined | null, level: number, done: boolean) {
        let elt = elmt;
        if (typeof elmt === 'string' && elmt[0] !== '{' && elmt[0] !== '[')
            elt = `"${elt}"`;

        if (done)
            this.container += this.indent(level + 1) + `"${key}": ${elt}` + '\n' + this.indent(level) + '}';
        else
            this.container += this.indent(level + 1) + `"${key}": ${elt}` + ',\n';
    }

    value() {
        return this.container;
    }

}


const extractionFew_Few_PrettyStringify = {
    returnObject: ArrayToString.bind(null, 4),
    /* filter: (key: number) => key < 10, */

    object: {
        returnObject: ObjectToString.bind(null, 4),

        properties: {

            name: {
                mutate: (key: string, name: string, level: number) => 'Ta mere LA PUTE : ' + name
            } as LiteralOptionProperties,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,
                returnObject: ObjectToString.bind(null, 4),

                properties: {
                    string: {
                        returnObject: ObjectToString.bind(null, 4),

                        unified: true,
                        image: {
                            mutate: (key: string, image: string, level: number) => 'L IMAGE qui tue : ' + image
                        } as LiteralOption,
                        sheet_x: true
                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;


if (test.stringify) {
    const stringified = Element.create(require('../../json-test/emojis-few-few'), extractionFew_Few_PrettyStringify).parse();
    const fileName = path.join(jsonDir, 'emojis_few_few_stringify.json');

    fs.ensureFile(fileName)
        .then(
        () => fs.writeFile(fileName, stringified).then(
            () => console.log(`${fileName} :)`),
            err => Promise.reject(err)),

        err => console.error(err));

}
