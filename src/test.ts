import { convert, ConvertOptions, ObjectConvertOptions } from '.';


/* const options: ConvertOptions = {
    all: true
};


const all = convert({ a: 1, b: '2', c: { c1: { c2: true } } }, options);
console.log(all);
 */


/* const options: ConvertOptions = {
    filter: {
        visitor: (key, _value, { isLeaf }) => {
            return isLeaf || [ 'a', 'c', '1', '3', 'c2' ].some(k => k === key);
        },
        recursive: true
    }
};
 */

const options: ObjectConvertOptions<{ a: number; }> = {
    object: {
        filter: (key, _value) => `${key}`.startsWith('c'),
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
    a: 1,
    c: [ 2, { c2: [ 4, 5 ] } ]
};

const converted = convert({
    a: 1,
    b: 'b',
    c: [ 'c', 2, { c1: 3, c2: [ 4, '5' ] } ],
    d: { d1: 6, d2: 'd2' }
}, options);


console.log({ expected, converted });
