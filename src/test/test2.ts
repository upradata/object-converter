import { Element } from '../parser/element';
import { Option, OptionProperties } from '../parser/option';
import * as emojisJson from 'emoji-datasource/emoji.json';

import { ArrayOptionProperties } from '../parser/array/array-option';
import { ObjectOptionProperties, MembersOptionProperties } from '../parser/object/object-option';
import { LiteralOptionProperties, LiteralOption } from '../parser/litral/literal-option';

import * as fs from 'fs-extra';
import * as path from 'path';
import { KeyType, VisitorRecursive } from '../parser/definition';


const test = {
    all_Null_Remover: true,
    all_Null_Remover_Recursive: true,
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


if (test.all)
    $writeJson(path.join(jsonDir, 'emojis-all.json'), Element.create(emojisJson, extractionAll).parse()).then(
        fileName => console.log(`${fileName} done :)`),
        err => console.error(err)
    );

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



const extractionFew_Few_WithVisitor = {

    elementOption: {

        elementOption: {

            name: {
                mutate: (key: string, name: string) => 'Ta mere LA PUTE : ' + name
            } as LiteralOption,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,

                elementOption: {
                    string: {
                        unified: true,
                        image: {
                            mutate: (key: string, image: string) => 'L IMAGE qui tue : ' + image
                        } as LiteralOption,
                        sheet_x: true
                    } as ObjectOptionProperties

                } as MembersOptionProperties

            } as ObjectOptionProperties

        } as MembersOptionProperties

    } as ObjectOptionProperties

} as ArrayOptionProperties;


const extractionFew_Few_WithVisitor2_A_FAIRE = {

    object: {

        properties: {

            name: {
                mutate: (key: string, name: string) => 'Ta mere LA PUTE : ' + name
            } as LiteralOption,
            unified: true,
            sheet_x: true,
            skin_variations: {
                all: true,

                properties: {
                    string: {
                        unified: true,
                        image: {
                            mutate: (key: string, image: string) => 'L IMAGE qui tue : ' + image
                        } as LiteralOption,
                        sheet_x: true
                    } as MembersOptionProperties

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



if (test.all_Null_Remover_Recursive)
    $writeJson(path.join(jsonDir, 'emojis_all_null_remover_recursive.json'), Element.create(emojisJson, extractionAll_Null_Remover_Recursive).parse()).then(
        fileName => console.log(`${fileName} :)`),
        err => console.error(err)
    );
