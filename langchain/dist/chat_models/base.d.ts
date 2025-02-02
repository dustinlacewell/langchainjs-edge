import { BaseChatMessage, BasePromptValue, ChatResult, LLMResult } from "../schema/index.js";
import { BaseLanguageModel, BaseLanguageModelParams } from "../base_language/index.js";
export type SerializedChatModel = {
    _model: string;
    _type: string;
} & Record<string, any>;
export type SerializedLLM = {
    _model: string;
    _type: string;
} & Record<string, any>;
export type BaseChatModelParams = BaseLanguageModelParams;
export declare abstract class BaseChatModel extends BaseLanguageModel {
    protected constructor({ ...rest }: BaseChatModelParams);
    abstract _combineLLMOutput?(...llmOutputs: LLMResult["llmOutput"][]): LLMResult["llmOutput"];
    generate(messages: BaseChatMessage[][], stop?: string[]): Promise<LLMResult>;
    _modelType(): string;
    abstract _llmType(): string;
    private _tokenizer?;
    getNumTokens(text: string): number;
    generatePrompt(promptValues: BasePromptValue[], stop?: string[]): Promise<LLMResult>;
    abstract _generate(messages: BaseChatMessage[], stop?: string[]): Promise<ChatResult>;
    call(messages: BaseChatMessage[], stop?: string[]): Promise<BaseChatMessage>;
    callPrompt(promptValue: BasePromptValue, stop?: string[]): Promise<BaseChatMessage>;
}
export declare abstract class SimpleChatModel extends BaseChatModel {
    abstract _call(messages: BaseChatMessage[], stop?: string[]): Promise<string>;
    _generate(messages: BaseChatMessage[], stop?: string[]): Promise<ChatResult>;
}
