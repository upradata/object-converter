import emojis from '../data/emoji.json';
import { convert } from '../../src';
import { Emoji } from '../data';



describe('object converter', () => {

    it('should work remove all "null"', () => {
        const converted = convert(emojis, {
            filter: {
                value: (key, value) => value !== null,
                recursive: true
            }
        });

        expect(JSON.stringify(converted).match('null')).toBe(null);
        expect(converted).toMatchSnapshot();
    });


    it('should mutate the category to an object with the name and subcategory', () => {
        type ConvertedEmoji = Omit<Emoji, 'category' | 'subcategory'> & {
            category: { name: string; subcategory: string; };
            subcategory: undefined;
        };


        const converted: ConvertedEmoji[] = convert(emojis, {
            mutate: (key, value) => {
                const newValue = {
                    ...value,
                    category: {
                        name: value.category,
                        subcategory: value.subcategory
                    }
                };

                delete newValue.subcategory;
                return newValue;
                // return value;
            }
        });

        for (const [ i, emoji ] of Object.entries(converted)) {
            expect(emoji.subcategory).toBe(undefined);
            expect(emoji.category.name).toBe(emojis[ i ].category);
            expect(emoji.category.subcategory).toBe(emojis[ i ].subcategory);
        }

        expect(converted).toMatchSnapshot();
    });


    it('should mutate the category to an object with the name and subcategory', () => {

        const converted = convert<Emoji[], Emoji[]>(emojis, {
            filter: {
                value: (key, value) => value !== null,
                recursive: true
            },
            array: {
                filter: {
                    value: key => key % 2 === 0,
                    recursive: true
                }
            },
            next: {
                name: {
                    mutate: (key, value) => `${String(key)} ==> ${value}`
                }
            }
        });

        for (const [ i, emoji ] of Object.entries(converted)) {
            expect(emoji.subcategory).toBe(undefined);
            expect(emoji.category.name).toBe(emojis[ i ].category);
            expect(emoji.category.subcategory).toBe(emojis[ i ].subcategory);
        }

        expect(converted).toMatchSnapshot();
    });
});
