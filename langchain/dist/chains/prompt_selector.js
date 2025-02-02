import { BaseChatModel } from "../chat_models/base.js";
import { BaseLanguageModel } from "../base_language/index.js";
export class BasePromptSelector {
}
export class ConditionalPromptSelector extends BasePromptSelector {
    constructor(default_prompt, conditionals = []) {
        super();
        Object.defineProperty(this, "defaultPrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "conditionals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.defaultPrompt = default_prompt;
        this.conditionals = conditionals;
    }
    getPrompt(llm) {
        for (const [condition, prompt] of this.conditionals) {
            if (condition(llm)) {
                return prompt;
            }
        }
        return this.defaultPrompt;
    }
}
export function isLLM(llm) {
    return llm instanceof BaseLanguageModel;
}
export function isChatModel(llm) {
    return llm instanceof BaseChatModel;
}
//# sourceMappingURL=prompt_selector.js.map