import { HumanChatMessage, AIChatMessage, } from "../schema/index.js";
import { BaseMemory, getInputValue, } from "./base.js";
export class ChatMessageHistory {
    constructor(messages) {
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.messages = messages ?? [];
    }
    addUserMessage(message) {
        this.messages.push(new HumanChatMessage(message));
    }
    addAIChatMessage(message) {
        this.messages.push(new AIChatMessage(message));
    }
}
export class BaseChatMemory extends BaseMemory {
    constructor(fields) {
        super();
        Object.defineProperty(this, "chatHistory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chatHistory = fields?.chatHistory ?? new ChatMessageHistory();
        this.returnMessages = fields?.returnMessages ?? this.returnMessages;
        this.inputKey = fields?.inputKey ?? this.inputKey;
        this.outputKey = fields?.outputKey ?? this.outputKey;
    }
    async saveContext(inputValues, outputValues) {
        this.chatHistory.addUserMessage(getInputValue(inputValues, this.inputKey));
        this.chatHistory.addAIChatMessage(getInputValue(outputValues, this.outputKey));
    }
}
//# sourceMappingURL=chat_memory.js.map