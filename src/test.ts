import { isNumber, isString } from '@upradata/util';
import { convert, ConvertOptions } from '.';

export interface Data {
    a: number;
    b: string;
    c: [ string, number, { c1: number; c2: [ number, string ]; c3: string; } ];
    d: { d1: number; d2: string; };
}


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

/* const options: ConvertOptions<Data> = {
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
    c: [ 'c', 2, { c1: 3, c2: [ 4, '5' ], c3: '3' } ],
    d: { d1: 6, d2: 'd2' }
}, options);

 */


/* const options: ConvertOptions<Data> = {
    next: {
        filter: (key, _value, { isLeaf }) => isLeaf || [ 'a', 'c', 1, 2, 'c2', 'd2' ].some(k => k === key)
    }
}; */

const options: ConvertOptions<Data> = {
    options: (key, value) => {
        if (key === 'a')
            return { mutate: (key, value) => `${key} => ${value}` };

        if (key === 'c')
            return {
                next: {
                    filter: (key, _value) => [ 1, 2 ].some(k => k === key),
                    mutate: (key, value, { isLeaf }) => {
                        if (!isLeaf && (isString(value) || isNumber(value)))
                            return `${key} !! ${value}`;

                        return value;
                    }
                },
            };

        if ((value as any).d1 === 6)
            return { mutate: () => ({ ...(value as { d1: number; d2: string; }), d3: 3 }) };
    }
};

const converted = convert({
    a: 1,
    b: 'b',
    c: [ 'c', 2, { c1: 3, c2: [ 4, '5' ], c3: '3' } ],
    d: { d1: 6, d2: 'd2' }
}, options);


const expected = {
    a: 1,
    b: 'b',
    c: [ 2, { c1: 3, c2: [ 4, '5' ], c3: '3' } ],
    d: { d1: 6, d2: 'd2', d3: 3 }
};


console.log({ expected, converted });
