import { BasePromptValue, LLMResult } from "../schema/index.js";
import { CallbackManager } from "../callbacks/index.js";
import { AsyncCaller, AsyncCallerParams } from "../util/async_caller.js";
export type SerializedLLM = {
    _model: string;
    _type: string;
} & Record<string, any>;
/**
 * Base interface for language model parameters.
 * A subclass of {@link BaseLanguageModel} should have a constructor that
 * takes in a parameter that extends this interface.
 */
export interface BaseLanguageModelParams extends AsyncCallerParams {
    verbose?: boolean;
    callbackManager?: CallbackManager;
}
/**
 * Base class for language models.
 */
export declare abstract class BaseLanguageModel implements BaseLanguageModelParams {
    /**
     * Whether to print out response text.
     */
    verbose: boolean;
    callbackManager: CallbackManager;
    /**
     * The async caller should be used by subclasses to make any async calls,
     * which will thus benefit from the concurrency and retry logic.
     */
    protected caller: AsyncCaller;
    protected constructor(params: BaseLanguageModelParams);
    abstract generatePrompt(promptValues: BasePromptValue[], stop?: string[]): Promise<LLMResult>;
    abstract _modelType(): string;
    abstract _llmType(): string;
    abstract getNumTokens(text: string): number;
    /**
     * Get the identifying parameters of the LLM.
     */
    _identifyingParams(): Record<string, any>;
    /**
     * Return a json-like object representing this LLM.
     */
    serialize(): SerializedLLM;
    /**
     * Load an LLM from a json-like object describing it.
     */
    static deserialize(data: SerializedLLM): Promise<BaseLanguageModel>;
}
