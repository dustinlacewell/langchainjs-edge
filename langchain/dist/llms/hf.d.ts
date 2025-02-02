import { LLM, BaseLLMParams } from "./base.js";
interface HFInput {
    /** Model to use */
    model: string;
    /** Sampling temperature to use */
    temperature?: number;
    /**
     * Maximum number of tokens to generate in the completion.
     */
    maxTokens?: number;
    /** Total probability mass of tokens to consider at each step */
    topP?: number;
    /** Integer to define the top tokens considered within the sample operation to create new text. */
    topK?: number;
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty?: number;
}
export declare class HuggingFaceInference extends LLM implements HFInput {
    model: string;
    temperature: number | undefined;
    maxTokens: number | undefined;
    topP: number | undefined;
    topK: number | undefined;
    frequencyPenalty: number | undefined;
    constructor(fields?: Partial<HFInput> & BaseLLMParams);
    _llmType(): string;
    _call(prompt: string, _stop?: string[]): Promise<string>;
    static imports(): Promise<{
        HfInference: typeof import("@huggingface/inference").HfInference;
    }>;
}
export {};
