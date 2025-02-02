import GPT3Tokenizer from "gpt3-tokenizer";
import { BaseCache, InMemoryCache } from "../cache.js";
import { BaseLanguageModel, } from "../base_language/index.js";
/**
 * LLM Wrapper. Provides an {@link call} (an {@link generate}) function that takes in a prompt (or prompts) and returns a string.
 */
export class BaseLLM extends BaseLanguageModel {
    constructor({ cache, concurrency, ...rest }) {
        super(concurrency ? { maxConcurrency: concurrency, ...rest } : rest);
        /**
         * The name of the LLM class
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (cache instanceof BaseCache) {
            this.cache = cache;
        }
        else if (cache) {
            this.cache = InMemoryCache.global();
        }
        else {
            this.cache = undefined;
        }
    }
    async generatePrompt(promptValues, stop) {
        const prompts = promptValues.map((promptValue) => promptValue.toString());
        return this.generate(prompts, stop);
    }
    /** @ignore */
    async _generateUncached(prompts, stop) {
        await this.callbackManager.handleLLMStart({ name: this._llmType() }, prompts, this.verbose);
        let output;
        try {
            output = await this._generate(prompts, stop);
        }
        catch (err) {
            await this.callbackManager.handleLLMError(err, this.verbose);
            throw err;
        }
        await this.callbackManager.handleLLMEnd(output, this.verbose);
        return output;
    }
    /**
     * Run the LLM on the given propmts an input, handling caching.
     */
    async generate(prompts, stop) {
        if (!Array.isArray(prompts)) {
            throw new Error("Argument 'prompts' is expected to be a string[]");
        }
        if (!this.cache) {
            return this._generateUncached(prompts, stop);
        }
        const { cache } = this;
        const params = this.serialize();
        params.stop = stop;
        const llmStringKey = `${Object.entries(params).sort()}`;
        const missingPromptIndices = [];
        const generations = await Promise.all(prompts.map(async (prompt, index) => {
            const result = await cache.lookup(prompt, llmStringKey);
            if (!result) {
                missingPromptIndices.push(index);
            }
            return result;
        }));
        let llmOutput = {};
        if (missingPromptIndices.length > 0) {
            const results = await this._generateUncached(missingPromptIndices.map((i) => prompts[i]), stop);
            await Promise.all(results.generations.map(async (generation, index) => {
                const promptIndex = missingPromptIndices[index];
                generations[promptIndex] = generation;
                return cache.update(prompts[promptIndex], llmStringKey, generation);
            }));
            llmOutput = results.llmOutput ?? {};
        }
        return { generations, llmOutput };
    }
    /**
     * Convenience wrapper for {@link generate} that takes in a single string prompt and returns a single string output.
     */
    async call(prompt, stop) {
        const { generations } = await this.generate([prompt], stop);
        return generations[0][0].text;
    }
    /**
     * Get the identifying parameters of the LLM.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _identifyingParams() {
        return {};
    }
    /**
     * Return a json-like object representing this LLM.
     */
    serialize() {
        return {
            ...this._identifyingParams(),
            _type: this._llmType(),
            _model: this._modelType(),
        };
    }
    _modelType() {
        return "base_llm";
    }
    /**
     * Load an LLM from a json-like object describing it.
     */
    static async deserialize(data) {
        const { _type, _model, ...rest } = data;
        if (_model && _model !== "base_llm") {
            throw new Error(`Cannot load LLM with model ${_model}`);
        }
        const Cls = {
            openai: (await import("./openai.js")).OpenAI,
        }[_type];
        if (Cls === undefined) {
            throw new Error(`Cannot load  LLM with type ${_type}`);
        }
        return new Cls(rest);
    }
    getNumTokens(text) {
        // TODOs copied from py implementation
        // TODO: this method may not be exact.
        // TODO: this method may differ based on model (eg codex, gpt-3.5).
        if (this._tokenizer === undefined) {
            const Constructor = GPT3Tokenizer.default;
            this._tokenizer = new Constructor({ type: "gpt3" });
        }
        return this._tokenizer.encode(text).bpe.length;
    }
}
/**
 * LLM class that provides a simpler interface to subclass than {@link BaseLLM}.
 *
 * Requires only implementing a simpler {@link _call} method instead of {@link _generate}.
 *
 * @augments BaseLLM
 */
export class LLM extends BaseLLM {
    async _generate(prompts, stop) {
        const generations = [];
        for (let i = 0; i < prompts.length; i += 1) {
            const text = await this._call(prompts[i], stop);
            generations.push([{ text }]);
        }
        return { generations };
    }
}
//# sourceMappingURL=base.js.map