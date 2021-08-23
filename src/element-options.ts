import { Key, RecursiveProp, TransformerDetails } from './types';
import { Options, BaseOptions, BaseOpts, DetailsOpts } from './options';
import { Returnable } from './returnable';

// type VisitorProps = ExtractKeysType<ConvertOptionsBase, Transformer | RecursiveTransformer>;


export class ElementOptions<T = unknown, U = T> {
    readonly base: BaseOptions<T, U>;
    readonly details: DetailsOpts<T, U>;
    readonly returnable: Returnable;

    constructor(options: Options<T, U>) {
        this.base = new BaseOptions(options);
        this.details = options;

        const { returnableCtor: ReturnableCtor } = options;
        this.returnable = new ReturnableCtor();
    }


    public getOptions(key: Key, value: T, details: TransformerDetails): BaseOptions<T, U> {
        const { options: opts } = this.base;

        const options = {
            ...this.base,
            ...this.getDetailedOptions(key, value),
            ...opts?.value(key, value, details)
        };

        return new BaseOptions<T, U>(options);
    }


    public getNextOptions(overrideOptions?: RecursiveProp<BaseOpts>): BaseOpts {
        const opts = {} as BaseOpts<T, U>;

        for (const [ key, value ] of Object.entries({ ...this.base, next: overrideOptions })) {

            if (value?.recursive) {
                opts[ key ] = value;
            }
        }

        return { ...opts, ...this.base.next.value, ...overrideOptions.value };
    }


    protected getDetailedOptions(_key: Key, _json: unknown): BaseOpts<T, U> {
        return undefined;
    }
}
