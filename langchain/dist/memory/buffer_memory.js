import { getBufferString } from "./base.js";
import { BaseChatMemory } from "./chat_memory.js";
export class BufferMemory extends BaseChatMemory {
    constructor(fields) {
        super({
            returnMessages: fields?.returnMessages ?? false,
            inputKey: fields?.inputKey,
            outputKey: fields?.outputKey,
        });
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
    }
    async loadMemoryVariables(_values) {
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: this.chatHistory.messages,
            };
            return result;
        }
        const result = {
            [this.memoryKey]: getBufferString(this.chatHistory.messages),
        };
        return result;
    }
}
//# sourceMappingURL=buffer_memory.js.map