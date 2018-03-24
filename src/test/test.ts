import { Parse } from '../parse';
import * as emojisJson from 'emoji-datasource/emoji.json';
import { ListOption } from '../list';


const content = new Parse(emojisJson, new ListOption({ all: true })).parse();
console.log(content);
