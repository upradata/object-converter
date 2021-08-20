import { isNumber, isString } from '@upradata/util';
import { convert, ConvertOptions, ObjectConvertOptions, RecursiveTransformer } from '../src';
import { Data, data } from './data';



describe('Test json parser', () => {

    it('option "all" should work', () => {
        expect(convert(data())).toEqual(data());
    });


    it('non-recursive option "mutate" should work', () => {
        const converted = convert(data(), {
            mutate: (key, value) => {
                if (isString(value) || isNumber(value))
                    return `${key} => ${value}`;

                return value;
            }
        });

        expect(converted).toEqual({
            a: 'a => 1',
            b: 'b => b',
            c: [ 'c', 2, { c1: 3, c2: [ 4, '5' ], c3: '3' } ],
            d: { d1: 6, d2: 'd2' }
        });
    });


    it('recursive option "mutate" should work', () => {
        const options: ConvertOptions = {
            mutate: {
                transform: (key, value, { isLeaf }) => {
                    if (!isLeaf && (isString(value) || isNumber(value)))
                        return `${key} => ${value}`;

                    return value;
                },
                recursive: true
            }
        };


        const expected = {
            a: 'a => 1',
            b: 'b => b',
            c: [ '0 => c', '1 => 2', { c1: 'c1 => 3', c2: [ '0 => 4', '1 => 5' ], c3: 'c3 => 3' } ],
            d: { d1: 'd1 => 6', d2: 'd2 => d2' }
        };

        expect(convert(data(), options)).toEqual(expected);
        expect(convert(data(), { mutate: new RecursiveTransformer(options.mutate, true) })).toEqual(expected);
    });


    it('non-recursive option "filter" should work', () => {
        const options: ConvertOptions = {
            filter: (key, _value, { isLeaf }) => isLeaf || [ 'a', 'c', 1, 2, 'c2' ].some(k => k === key)
        };

        const expected = {
            a: 1,
            c: [ 'c', 2, { c1: 3, c2: [ 4, '5' ], c3: '3' } ]
        };


        expect(convert(data(), options)).toEqual(expected);
    });


    it('recursive option "filter" should work', () => {
        const options: ConvertOptions = {
            filter: {
                transform: (key, _value, { isLeaf }) => {
                    return isLeaf || [ 'a', 'c', 1, 2, 'c2' ].some(k => k === key);
                },
                recursive: true
            }
        };


        const expected = {
            a: 1,
            c: [ 2, { c2: [ '5' ] } ]
        };

        expect(convert(data(), options)).toEqual(expected);
        expect(convert(data(), { filter: new RecursiveTransformer(options.filter, true) })).toEqual(expected);
    });


    it('detailed options should work', () => {
        const options: ObjectConvertOptions<Data> = {
            object: {
                filter: {
                    transform: (key, _value) => `${key}`.startsWith('c'),
                    recursive: true
                }
            },
            a: {
                mutate: (key, value) => `${key} => ${value}`
            },
            mutate: {
                transform: (key, value, { isLeaf }) => !isLeaf && typeof value === 'string' ? `${key} <> ${value}` : value,
                recursive: true
            }
        };

        const expected = {
            a: 'a => 1',
            b: 'b <> b',
            c: [ '0 <> c', 2, { c1: 3, c2: [ 4, '1 <> 5' ], c3: 'c3 <> 3' } ]
        };

        expect(convert(data(), options)).toEqual(expected);
    });
});
