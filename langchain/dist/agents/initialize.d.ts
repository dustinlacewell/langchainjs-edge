import { Tool } from "./tools/index.js";
import { AgentExecutor } from "./executor.js";
import { BaseLanguageModel } from "../base_language/index.js";
import { CallbackManager } from "../callbacks/index.js";
type AgentType = "zero-shot-react-description" | "chat-zero-shot-react-description" | "chat-conversational-react-description";
export declare const initializeAgentExecutor: (tools: Tool[], llm: BaseLanguageModel, agentType?: AgentType, verbose?: boolean, callbackManager?: CallbackManager) => Promise<AgentExecutor>;
export {};
