import { ChatCompletionRequestMessage, CreateChatCompletionRequest, ConfigurationParameters } from "openai-edge";
import { BaseLLMParams, LLM } from "./base.js";
interface ModelParams {
    /** Sampling temperature to use, between 0 and 2, defaults to 1 */
    temperature: number;
    /** Total probability mass of tokens to consider at each step, between 0 and 1, defaults to 1 */
    topP: number;
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty: number;
    /** Penalizes repeated tokens */
    presencePenalty: number;
    /** Number of chat completions to generate for each prompt */
    n: number;
    /** Dictionary used to adjust the probability of specific tokens being generated */
    logitBias?: Record<string, number>;
    /** Whether to stream the results or not */
    streaming: boolean;
}
/**
 * Input to OpenAI class.
 * @augments ModelParams
 */
interface OpenAIInput extends ModelParams {
    /** Model name to use */
    modelName: string;
    /** ChatGPT messages to pass as a prefix to the prompt */
    prefixMessages?: ChatCompletionRequestMessage[];
    /** Holds any additional parameters that are valid to pass to {@link
     * https://platform.openai.com/docs/api-reference/completions/create |
     * `openai.create`} that are not explicitly specified on this class.
     */
    modelKwargs?: Kwargs;
    /** List of stop words to use when generating */
    stop?: string[];
    /**
     * Maximum number of tokens to generate in the completion.  If not specified,
     * defaults to the maximum number of tokens allowed by the model.
     */
    maxTokens?: number;
}
type Kwargs = Record<string, any>;
/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/chat/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 *
 * @augments BaseLLM
 * @augments OpenAIInput
 */
export declare class OpenAIChat extends LLM implements OpenAIInput {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    n: number;
    logitBias?: Record<string, number>;
    maxTokens?: number;
    modelName: string;
    prefixMessages?: ChatCompletionRequestMessage[];
    modelKwargs?: Kwargs;
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
    invocationParams(): Omit<CreateChatCompletionRequest, "messages"> & Kwargs;
    _identifyingParams(): any;
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams(): any;
    private formatMessages;
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param prompt - The prompt to pass into the model.
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
    _call(prompt: string, stop?: string[]): Promise<string>;
    /** @ignore */
    completionWithRetry(request: CreateChatCompletionRequest): Promise<any>;
    _llmType(): string;
}
export {};
