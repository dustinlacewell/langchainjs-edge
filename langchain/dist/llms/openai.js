import { createParser } from "eventsource-parser";
import { Configuration, OpenAIApi, } from "openai-edge";
import fetchAdapter from "../util/axios-fetch-adapter.js";
import { chunkArray } from "../util/index.js";
import { BaseLLM } from "./base.js";
import { calculateMaxTokens } from "./calculateMaxTokens.js";
import { OpenAIChat } from "./openai-chat.js";
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
export class OpenAI extends BaseLLM {
    constructor(fields, configuration) {
        if (fields?.modelName?.startsWith("gpt-3.5-turbo") ||
            fields?.modelName?.startsWith("gpt-4")) {
            // eslint-disable-next-line no-constructor-return, @typescript-eslint/no-explicit-any
            return new OpenAIChat(fields, configuration);
        }
        super(fields ?? {});
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.7
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 256
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "frequencyPenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "presencePenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "n", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "bestOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "logitBias", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "text-davinci-003"
        });
        Object.defineProperty(this, "modelKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "batchSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 20
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Used for non-streaming requests
        Object.defineProperty(this, "batchClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Used for streaming requests
        Object.defineProperty(this, "streamingClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = fields?.openAIApiKey ?? process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key not found");
        }
        this.modelName = fields?.modelName ?? this.modelName;
        this.modelKwargs = fields?.modelKwargs ?? {};
        this.batchSize = fields?.batchSize ?? this.batchSize;
        this.temperature = fields?.temperature ?? this.temperature;
        this.maxTokens = fields?.maxTokens ?? this.maxTokens;
        this.topP = fields?.topP ?? this.topP;
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
        this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
        this.n = fields?.n ?? this.n;
        this.bestOf = fields?.bestOf ?? this.bestOf;
        this.logitBias = fields?.logitBias;
        this.stop = fields?.stop;
        this.streaming = fields?.streaming ?? false;
        if (this.streaming && this.n > 1) {
            throw new Error("Cannot stream results when n > 1");
        }
        if (this.streaming && this.bestOf > 1) {
            throw new Error("Cannot stream results when bestOf > 1");
        }
        this.clientConfig = {
            apiKey,
            ...configuration,
        };
    }
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams() {
        return {
            model: this.modelName,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            top_p: this.topP,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            n: this.n,
            best_of: this.bestOf,
            logit_bias: this.logitBias,
            stop: this.stop,
            stream: this.streaming,
            ...this.modelKwargs,
        };
    }
    _identifyingParams() {
        return {
            model_name: this.modelName,
            ...this.invocationParams(),
            ...this.clientConfig,
        };
    }
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams() {
        return this._identifyingParams();
    }
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
    async _generate(prompts, stop) {
        const subPrompts = chunkArray(prompts, this.batchSize);
        const choices = [];
        const tokenUsage = {};
        if (this.stop && stop) {
            throw new Error("Stop found in input and default params");
        }
        const params = this.invocationParams();
        params.stop = stop ?? params.stop;
        if (params.max_tokens === -1) {
            if (prompts.length !== 1) {
                throw new Error("max_tokens set to -1 not supported for multiple inputs");
            }
            params.max_tokens = await calculateMaxTokens({
                prompt: prompts[0],
                // Cast here to allow for other models that may not fit the union
                modelName: this.modelName,
            });
        }
        for (let i = 0; i < subPrompts.length; i += 1) {
            const { data } = await this.completionWithRetry({
                ...params,
                prompt: subPrompts[i],
            });
            if (params.stream) {
                const choice = await new Promise((resolve, reject) => {
                    const choice = {};
                    const parser = createParser((event) => {
                        if (event.type === "event") {
                            if (event.data === "[DONE]") {
                                resolve(choice);
                            }
                            else {
                                const response = JSON.parse(event.data);
                                const part = response.choices[0];
                                if (part != null) {
                                    choice.text = (choice.text ?? "") + (part.text ?? "");
                                    choice.finish_reason = part.finish_reason;
                                    choice.logprobs = part.logprobs;
                                    // eslint-disable-next-line no-void
                                    void this.callbackManager.handleLLMNewToken(part.text ?? "", true);
                                }
                            }
                        }
                    });
                    // workaround for incorrect axios types
                    const stream = data;
                    stream.on("data", (data) => parser.feed(data.toString("utf-8")));
                    stream.on("error", (error) => reject(error));
                });
                choices.push(choice);
            }
            else {
                choices.push(...data.choices);
            }
            const { completion_tokens: completionTokens, prompt_tokens: promptTokens, total_tokens: totalTokens, } = data.usage ?? {};
            if (completionTokens) {
                tokenUsage.completionTokens =
                    (tokenUsage.completionTokens ?? 0) + completionTokens;
            }
            if (promptTokens) {
                tokenUsage.promptTokens = (tokenUsage.promptTokens ?? 0) + promptTokens;
            }
            if (totalTokens) {
                tokenUsage.totalTokens = (tokenUsage.totalTokens ?? 0) + totalTokens;
            }
        }
        const generations = chunkArray(choices, this.n).map((promptChoices) => promptChoices.map((choice) => ({
            text: choice.text ?? "",
            generationInfo: {
                finishReason: choice.finish_reason,
                logprobs: choice.logprobs,
            },
        })));
        return {
            generations,
            llmOutput: { tokenUsage },
        };
    }
    /** @ignore */
    async completionWithRetry(request) {
        if (!request.stream && !this.batchClient) {
            const clientConfig = new Configuration({
                ...this.clientConfig,
                baseOptions: {
                    ...this.clientConfig.baseOptions,
                    adapter: fetchAdapter,
                },
            });
            this.batchClient = new OpenAIApi(clientConfig);
        }
        if (request.stream && !this.streamingClient) {
            const clientConfig = new Configuration(this.clientConfig);
            this.streamingClient = new OpenAIApi(clientConfig);
        }
        const client = !request.stream ? this.batchClient : this.streamingClient;
        return this.caller.call(client.createCompletion.bind(client), request, request.stream ? { responseType: "stream" } : undefined);
    }
    _llmType() {
        return "openai";
    }
}
/**
 * PromptLayer wrapper to OpenAI
 * @augments OpenAI
 */
export class PromptLayerOpenAI extends OpenAI {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "promptLayerApiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plTags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.plTags = fields?.plTags ?? [];
        this.promptLayerApiKey =
            fields?.promptLayerApiKey ?? process.env.PROMPTLAYER_API_KEY;
        if (!this.promptLayerApiKey) {
            throw new Error("Missing PromptLayer API key");
        }
    }
    async completionWithRetry(request) {
        if (request.stream) {
            return super.completionWithRetry(request);
        }
        const requestStartTime = Date.now();
        const response = await super.completionWithRetry(request);
        const requestEndTime = Date.now();
        // https://github.com/MagnivOrg/promptlayer-js-helper
        await this.caller.call(fetch, "https://api.promptlayer.com/track-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                function_name: "openai.Completion.create",
                args: [],
                kwargs: { engine: request.model, prompt: request.prompt },
                tags: this.plTags ?? [],
                request_response: response.data,
                request_start_time: Math.floor(requestStartTime / 1000),
                request_end_time: Math.floor(requestEndTime / 1000),
                api_key: process.env.PROMPTLAYER_API_KEY,
            }),
        });
        return response;
    }
}
//# sourceMappingURL=openai.js.map