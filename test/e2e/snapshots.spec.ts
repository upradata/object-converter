import emojis from '../data/emoji.json';
import { convert, makeRecursiveTransform } from '../../src';


interface Emoji {
    name: string;
    unified: string;
    non_qualified: string;
    docomo: string;
    au: string;
    softbank: string;
    google: string;
    image: string;
    sheet_x: number;
    sheet_y: number;
    short_name: string;
    short_names: string[];
    text: string;
    texts: string[];
    category: string;
    subcategory: string;
    sort_order: number;
    added_in: string;
    has_img_apple: boolean;
    has_img_google: boolean;
    has_img_twitter: boolean;
    has_img_facebook: boolean;
}


describe('object converter', () => {

    it('should work remove all "null"', () => {
        const converted = convert<Emoji[], Emoji[]>(emojis, {
            filter: makeRecursiveTransform((key, value) => value !== null)
        });

        expect(JSON.stringify(converted).match('null')).toBe(null);
        expect(converted).toMatchSnapshot();
    });


    it('should mutate the category to an object with the name and subcategory', () => {
        const converted = convert(emojis, {
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

        for (const [ i, emoji ] of Object.entries(
            converted as Array<Omit<Emoji, 'category' | 'subcategory'> & {
                category: { name: string; subcategory: string; };
                subcategory: undefined;
            }>)
        ) {
            expect(emoji.subcategory).toBe(undefined);
            expect(emoji.category.name).toBe(emojis[ i ].category);
            expect(emoji.category.subcategory).toBe(emojis[ i ].subcategory);
        }

        expect(converted).toMatchSnapshot();
    });
});
