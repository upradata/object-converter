import { Key, TransformerDetails } from './types';
import { Options, OptionsBase, OptsBase, OptsDetails } from './options.types';
import { Returnable } from './returnable';

// type VisitorProps = ExtractKeysType<ConvertOptionsBase, Transformer | RecursiveTransformer>;


export class ElementOptions<T = unknown, U = unknown> {
    readonly base: OptionsBase<T, U>;
    readonly details: OptsDetails<T, U>;
    readonly returnable: Returnable;

    constructor(options: Options<T, U>) {
        this.base = new OptionsBase(options);
        this.details = options;

        const { returnableCtor: ReturnableCtor } = options;
        this.returnable = new ReturnableCtor();
    }


    public getOptions(key: Key, value: T, details: TransformerDetails): OptionsBase<T, U> {
        const { get: overwrite } = this.base;

        const options = { ... this.getDetailedOptions(key, value), ...overwrite?.transform(key, value, details) };

        return new OptionsBase<T, U>(options);

        // pass down the parent options
        // if (isDefined(this.specific))
        // return this.specific;

        // default
        /* if (this.all)
            return this.setVisitorRecursiveOptions({ all: true }); */

        // throw new Error('Impossible');
    }


    public getNextOptions(): OptsBase<T, U> {
        const opts = {} as OptsBase<T, U>;

        for (const [ key, transformer ] of Object.entries(this.base)) {

            if (transformer?.recursive) {
                opts[ key ] = transformer;
            }
        }

        return opts;
    }


    protected getDetailedOptions(_key: Key, _json: unknown): OptsBase<T, U> {
        return undefined;
    }
}
