import { LLMChain } from "./llm_chain.js";
import { PromptTemplate } from "../prompts/index.js";
import { BufferMemory } from "../memory/index.js";
const defaultTemplate = `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{history}
Human: {input}
AI:`;
export class ConversationChain extends LLMChain {
    constructor(fields) {
        super({
            prompt: fields.prompt ??
                new PromptTemplate({
                    template: defaultTemplate,
                    inputVariables: ["history", "input"],
                }),
            llm: fields.llm,
            outputKey: fields.outputKey ?? "response",
        });
        this.memory = fields.memory ?? new BufferMemory();
    }
}
//# sourceMappingURL=conversation.js.map