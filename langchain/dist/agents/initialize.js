import { AgentExecutor } from "./executor.js";
import { ZeroShotAgent } from "./mrkl/index.js";
import { ChatConversationalAgent } from "./chat_convo/index.js";
import { ChatAgent } from "./chat/index.js";
import { getCallbackManager } from "../callbacks/index.js";
export const initializeAgentExecutor = async (tools, llm, agentType = "zero-shot-react-description", verbose = false, callbackManager = getCallbackManager()) => {
    switch (agentType) {
        case "zero-shot-react-description":
            return AgentExecutor.fromAgentAndTools({
                agent: ZeroShotAgent.fromLLMAndTools(llm, tools),
                tools,
                returnIntermediateSteps: true,
                verbose,
                callbackManager,
            });
        case "chat-zero-shot-react-description":
            return AgentExecutor.fromAgentAndTools({
                agent: ChatAgent.fromLLMAndTools(llm, tools),
                tools,
                returnIntermediateSteps: true,
                verbose,
                callbackManager,
            });
        case "chat-conversational-react-description":
            return AgentExecutor.fromAgentAndTools({
                agent: ChatConversationalAgent.fromLLMAndTools(llm, tools),
                tools,
                verbose,
                callbackManager,
            });
        default:
            throw new Error("Unknown agent type");
    }
};
//# sourceMappingURL=initialize.js.map