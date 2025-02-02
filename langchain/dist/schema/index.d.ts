import { Document } from "../document.js";
export type Example = Record<string, string>;
export type InputValues = Record<string, any>;
export type PartialValues = Record<string, string | (() => Promise<string>) | (() => string)>;
/**
 * Output of a single generation.
 */
export interface Generation {
    /**
     * Generated text output
     */
    text: string;
    /**
     * Raw generation info response from the provider.
     * May include things like reason for finishing (e.g. in {@link OpenAI})
     */
    generationInfo?: Record<string, any>;
}
/**
 * Contains all relevant information returned by an LLM.
 */
export type LLMResult = {
    /**
     * List of the things generated. Each input could have multiple {@link Generation | generations}, hence this is a list of lists.
     */
    generations: Generation[][];
    /**
     * Dictionary of arbitrary LLM-provider specific output.
     */
    llmOutput?: Record<string, any>;
};
export type MessageType = "human" | "ai" | "generic" | "system";
export declare abstract class BaseChatMessage {
    /** The text of the message. */
    text: string;
    /** The type of the message. */
    abstract _getType(): MessageType;
    constructor(text: string);
}
export declare class HumanChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class AIChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class SystemChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class ChatMessage extends BaseChatMessage {
    role: string;
    constructor(text: string, role: string);
    _getType(): MessageType;
}
export interface ChatGeneration extends Generation {
    message: BaseChatMessage;
}
export interface ChatResult {
    generations: ChatGeneration[];
    llmOutput?: Record<string, any>;
}
/**
 * Base PromptValue class. All prompt values should extend this class.
 */
export declare abstract class BasePromptValue {
    abstract toString(): string;
    abstract toChatMessages(): BaseChatMessage[];
}
export type AgentAction = {
    tool: string;
    toolInput: string;
    log: string;
};
export type AgentFinish = {
    returnValues: Record<string, any>;
    log: string;
};
export type AgentStep = {
    action: AgentAction;
    observation: string;
};
export type ChainValues = Record<string, any>;
/**
 * Base Index class. All indexes should extend this class.
 */
export declare abstract class BaseRetriever {
    abstract getRelevantDocuments(query: string): Promise<Document[]>;
}
/** Class to parse the output of an LLM call.
 */
export declare abstract class BaseOutputParser {
    /**
     * Parse the output of an LLM call.
     *
     * @param text - LLM output to parse.
     * @returns Parsed output.
     */
    abstract parse(text: string): Promise<unknown>;
    parseWithPrompt(text: string, _prompt: BasePromptValue): Promise<unknown>;
    /**
     * Return a string describing the format of the output.
     * @returns Format instructions.
     * @example
     * ```json
     * {
     *  "foo": "bar"
     * }
     * ```
     */
    abstract getFormatInstructions(): string;
    /**
     * Return the string type key uniquely identifying this class of parser
     */
    _type(): string;
}
export declare class OutputParserException extends Error {
    constructor(message: string);
}
