import { getCallbackManager } from "../callbacks/index.js";
const getVerbosity = () => false;
/**
 * Base interface that all chains must implement.
 */
export class BaseChain {
    constructor(memory, verbose, callbackManager) {
        Object.defineProperty(this, "memory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "callbackManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.memory = memory;
        this.verbose = verbose ?? getVerbosity();
        this.callbackManager = callbackManager ?? getCallbackManager();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async run(input) {
        const isKeylessInput = this.inputKeys.length === 1;
        if (!isKeylessInput) {
            throw new Error(`Chain ${this._chainType()} expects multiple inputs, cannot use 'run' `);
        }
        const values = { [this.inputKeys[0]]: input };
        const returnValues = await this.call(values);
        const keys = Object.keys(returnValues);
        if (keys.length === 1) {
            const finalReturn = returnValues[keys[0]];
            return finalReturn;
        }
        throw new Error("return values have multiple keys, `run` only supported when one key currently");
    }
    /**
     * Run the core logic of this chain and add to output if desired.
     *
     * Wraps {@link _call} and handles memory.
     */
    async call(values) {
        const fullValues = { ...values };
        if (!(this.memory == null)) {
            const newValues = await this.memory.loadMemoryVariables(values);
            for (const [key, value] of Object.entries(newValues)) {
                fullValues[key] = value;
            }
        }
        await this.callbackManager.handleChainStart({ name: this._chainType() }, fullValues, this.verbose);
        let outputValues;
        try {
            outputValues = await this._call(fullValues);
        }
        catch (e) {
            await this.callbackManager.handleChainError(e, this.verbose);
            throw e;
        }
        await this.callbackManager.handleChainEnd(outputValues, this.verbose);
        if (!(this.memory == null)) {
            await this.memory.saveContext(values, outputValues);
        }
        return outputValues;
    }
    /**
     * Call the chain on all inputs in the list
     */
    async apply(inputs) {
        return Promise.all(inputs.map(async (i) => this.call(i)));
    }
    /**
     * Load a chain from a json-like object describing it.
     */
    static async deserialize(data, values = {}) {
        switch (data._type) {
            case "llm_chain": {
                const { LLMChain } = await import("./index.js");
                return LLMChain.deserialize(data);
            }
            case "stuff_documents_chain": {
                const { StuffDocumentsChain } = await import("./index.js");
                return StuffDocumentsChain.deserialize(data);
            }
            case "vector_db_qa": {
                const { VectorDBQAChain } = await import("./index.js");
                return VectorDBQAChain.deserialize(data, values);
            }
            default:
                throw new Error(`Invalid prompt type in config: ${data._type}`);
        }
    }
}
//# sourceMappingURL=base.js.map