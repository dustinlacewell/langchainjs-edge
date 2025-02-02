import { LLM } from "./base.js";
export class Cohere extends LLM {
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 250
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = process.env.COHERE_API_KEY;
        if (!apiKey) {
            throw new Error("Please set the COHERE_API_KEY environment variable");
        }
        this.apiKey = apiKey;
        this.maxTokens = fields?.maxTokens ?? this.maxTokens;
        this.temperature = fields?.temperature ?? this.temperature;
        this.model = fields?.model ?? this.model;
    }
    _llmType() {
        return "cohere";
    }
    async _call(prompt, _stop) {
        const { cohere } = await Cohere.imports();
        cohere.init(this.apiKey);
        // Hit the `generate` endpoint on the `large` model
        const generateResponse = await this.caller.call(cohere.generate.bind(cohere), {
            prompt,
            model: this.model,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
        });
        try {
            return generateResponse.body.generations[0].text;
        }
        catch {
            console.log(generateResponse);
            throw new Error("Could not parse response.");
        }
    }
    static async imports() {
        try {
            const { default: cohere } = await import("cohere-ai");
            return { cohere };
        }
        catch (e) {
            throw new Error("Please install cohere-ai as a dependency with, e.g. `yarn add cohere-ai`");
        }
    }
}
//# sourceMappingURL=cohere.js.map