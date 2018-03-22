import { Parse } from '../parse';
import * as emojisJson from 'emoji-datasource/emoji.json';
import { ListOption } from '../list';


new Parse(emojisJson, new ListOption({ all: true })).parse();
