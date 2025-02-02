import { BaseChatMessage } from "../schema/index.js";
import { BaseMemory, InputValues, OutputValues } from "./base.js";
export declare class ChatMessageHistory {
    messages: BaseChatMessage[];
    constructor(messages?: BaseChatMessage[]);
    addUserMessage(message: string): void;
    addAIChatMessage(message: string): void;
}
export interface BaseMemoryInput {
    chatHistory: ChatMessageHistory;
    returnMessages: boolean;
    inputKey?: string;
    outputKey?: string;
}
export declare abstract class BaseChatMemory extends BaseMemory {
    chatHistory: ChatMessageHistory;
    returnMessages: boolean;
    inputKey?: string;
    outputKey?: string;
    constructor(fields?: Partial<BaseMemoryInput>);
    saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
}
