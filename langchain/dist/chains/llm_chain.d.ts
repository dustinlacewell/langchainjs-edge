import { BaseChain, ChainInputs } from "./base.js";
import { BaseMemory } from "../memory/index.js";
import { BasePromptTemplate } from "../prompts/index.js";
import { BaseLanguageModel } from "../base_language/index.js";
import { ChainValues, Generation, BasePromptValue, BaseOutputParser } from "../schema/index.js";
import { SerializedLLMChain } from "./serde.js";
export interface LLMChainInput extends ChainInputs {
    /** Prompt object to use */
    prompt: BasePromptTemplate;
    /** LLM Wrapper to use */
    llm: BaseLanguageModel;
    /** OutputParser to use */
    outputParser?: BaseOutputParser;
    /** @ignore */
    outputKey: string;
}
/**
 * Chain to run queries against LLMs.
 * @augments BaseChain
 * @augments LLMChainInput
 *
 * @example
 * ```ts
 * import { LLMChain, OpenAI, PromptTemplate } from "langchain";
 * const prompt = PromptTemplate.fromTemplate("Tell me a {adjective} joke");
 * const llm = LLMChain({ llm: new OpenAI(), prompt });
 * ```
 */
export declare class LLMChain extends BaseChain implements LLMChainInput {
    prompt: BasePromptTemplate;
    llm: BaseLanguageModel;
    outputKey: string;
    outputParser?: BaseOutputParser;
    get inputKeys(): string[];
    constructor(fields: {
        prompt: BasePromptTemplate;
        llm: BaseLanguageModel;
        outputKey?: string;
        memory?: BaseMemory;
        outputParser?: BaseOutputParser;
    });
    _getFinalOutput(generations: Generation[], promptValue: BasePromptValue): Promise<unknown>;
    _call(values: ChainValues): Promise<ChainValues>;
    /**
     * Format prompt with values and pass to LLM
     *
     * @param values - keys to pass to prompt template
     * @returns Completion from LLM.
     *
     * @example
     * ```ts
     * llm.predict({ adjective: "funny" })
     * ```
     */
    predict(values: ChainValues): Promise<string>;
    _chainType(): "llm_chain";
    static deserialize(data: SerializedLLMChain): Promise<LLMChain>;
    serialize(): SerializedLLMChain;
}
export declare class ConversationChain extends LLMChain {
    constructor(fields: {
        llm: BaseLanguageModel;
        prompt?: BasePromptTemplate;
        outputKey?: string;
        memory?: BaseMemory;
    });
}
