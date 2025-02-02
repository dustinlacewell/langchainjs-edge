import { CreateChatCompletionRequest, ConfigurationParameters } from "openai-edge";
import { BaseChatModel, BaseChatModelParams } from "./base.js";
import { BaseChatMessage, ChatResult } from "../schema/index.js";
interface TokenUsage {
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
}
interface OpenAILLMOutput {
    tokenUsage: TokenUsage;
}
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
    /** Whether to stream the results or not. Enabling disables tokenUsage reporting */
    streaming: boolean;
    /**
     * Maximum number of tokens to generate in the completion. If not specified,
     * defaults to the maximum number of tokens allowed by the model.
     */
    maxTokens?: number;
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
     * `openai.create`} that are not explicitly specified on this class.
     */
    modelKwargs?: Kwargs;
    /** List of stop words to use when generating */
    stop?: string[];
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
export declare class ChatOpenAI extends BaseChatModel implements OpenAIInput {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    n: number;
    logitBias?: Record<string, number>;
    modelName: string;
    modelKwargs?: Kwargs;
    stop?: string[];
    streaming: boolean;
    maxTokens?: number;
    private batchClient;
    private streamingClient;
    private clientConfig;
    constructor(fields?: Partial<OpenAIInput> & BaseChatModelParams & {
        concurrency?: number;
        cache?: boolean;
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
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param messages - The messages to pass into the model.
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
    _generate(messages: BaseChatMessage[], stop?: string[]): Promise<ChatResult>;
    /** @ignore */
    completionWithRetry(request: CreateChatCompletionRequest): Promise<any>;
    _llmType(): string;
    _combineLLMOutput(...llmOutputs: OpenAILLMOutput[]): OpenAILLMOutput;
}
export {};
