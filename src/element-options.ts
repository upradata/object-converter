import { Key, TransformerDetails } from './types';
import { ConvertOptions, ConvertOptionsBase, ConvertOptsBase, ConvertOptsDetails } from './options.types';
import { Returnable } from './returnable';

// type VisitorProps = ExtractKeysType<ConvertOptionsBase, Transformer | RecursiveTransformer>;


export class ElementOptions<T = unknown> {
    readonly base: ConvertOptionsBase;
    readonly details: ConvertOptsDetails<T>;
    readonly returnable: Returnable;

    constructor(options: ConvertOptions<T>) {
        this.base = new ConvertOptionsBase(options);
        this.details = options;

        const { returnableCtor: ReturnableCtor } = options;
        this.returnable = new ReturnableCtor();
    }


    public getOptions(key: Key, value: unknown, details: TransformerDetails): ConvertOptionsBase {
        const { overwrite } = this.base;

        const options = { ... this.getDetailedOptions(key, value), ...overwrite?.transform(key, value, details) };

        return new ConvertOptionsBase(options);

        // pass down the parent options
        // if (isDefined(this.specific))
        // return this.specific;

        // default
        /* if (this.all)
            return this.setVisitorRecursiveOptions({ all: true }); */

        // throw new Error('Impossible');
    }


    public getNextOptions(): ConvertOptsBase {
        const opts = {} as ConvertOptsBase;

        for (const [ key, transformer ] of Object.entries(this.base)) {

            if (transformer?.recursive) {
                opts[ key ] = transformer;
            }
        }

        return opts;
    }


    protected getDetailedOptions(_key: Key, _json: unknown): ConvertOptsBase {
        return undefined;
    }
}
