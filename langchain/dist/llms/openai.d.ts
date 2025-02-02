import { ConfigurationParameters, CreateCompletionRequest } from "openai-edge";
import { BaseLLM, BaseLLMParams } from "./base.js";
import { LLMResult } from "../schema/index.js";
interface ModelParams {
    /** Sampling temperature to use */
    temperature: number;
    /**
     * Maximum number of tokens to generate in the completion. -1 returns as many
     * tokens as possible given the prompt and the model's maximum context size.
     */
    maxTokens: number;
    /** Total probability mass of tokens to consider at each step */
    topP: number;
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty: number;
    /** Penalizes repeated tokens */
    presencePenalty: number;
    /** Number of completions to generate for each prompt */
    n: number;
    /** Generates `bestOf` completions server side and returns the "best" */
    bestOf: number;
    /** Dictionary used to adjust the probability of specific tokens being generated */
    logitBias?: Record<string, number>;
    /** Whether to stream the results or not. Enabling disables tokenUsage reporting */
    streaming: boolean;
}
/**
 * Input to OpenAI class.
 * @augments ModelParams
 */
interface OpenAIInput extends ModelParams {
    /** Model name to use */
    modelName: string;
    /** Holds any additional parameters that are valid to pass to {@link
     * https://platform.openai.com/docs/api-reference/completions/create |
     * `openai.createCompletion`} that are not explicitly specified on this class.
     */
    modelKwargs?: Kwargs;
    /** Batch size to use when passing multiple documents to generate */
    batchSize: number;
    /** List of stop words to use when generating */
    stop?: string[];
}
type Kwargs = Record<string, any>;
/**
 * Wrapper around OpenAI large language models.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/completions/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 *
 * @augments BaseLLM
 * @augments OpenAIInput
 */
export declare class OpenAI extends BaseLLM implements OpenAIInput {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    n: number;
    bestOf: number;
    logitBias?: Record<string, number>;
    modelName: string;
    modelKwargs?: Kwargs;
    batchSize: number;
    stop?: string[];
    streaming: boolean;
    private batchClient;
    private streamingClient;
    private clientConfig;
    constructor(fields?: Partial<OpenAIInput> & BaseLLMParams & {
        openAIApiKey?: string;
    }, configuration?: ConfigurationParameters);
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(): CreateCompletionRequest & Kwargs;
    _identifyingParams(): any;
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams(): any;
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param prompts - The prompts to pass into the model.
     * @param [stop] - Optional list of stop words to use when generating.
     *
     * @returns The full LLM output.
     *
     * @example
     * ```ts
     * import { OpenAI } from "langchain/llms";
     * const openai = new OpenAI();
     * const response = await openai.generate(["Tell me a joke."]);
     * ```
     */
    _generate(prompts: string[], stop?: string[]): Promise<LLMResult>;
    /** @ignore */
    completionWithRetry(request: CreateCompletionRequest): Promise<any>;
    _llmType(): string;
}
/**
 * PromptLayer wrapper to OpenAI
 * @augments OpenAI
 */
export declare class PromptLayerOpenAI extends OpenAI {
    promptLayerApiKey?: string;
    plTags?: string[];
    constructor(fields?: ConstructorParameters<typeof OpenAI>[0] & {
        promptLayerApiKey?: string;
        plTags?: string[];
    });
    completionWithRetry(request: CreateCompletionRequest): Promise<any>;
}
export {};
