import { LLMChain } from "../../chains/index.js";
import { PromptTemplate } from "../../prompts/index.js";
import { PREFIX, SUFFIX, formatInstructions } from "./prompt.js";
import { deserializeHelper } from "../helpers.js";
import { Agent } from "../agent.js";
const FINAL_ANSWER_ACTION = "Final Answer:";
/**
 * Agent for the MRKL chain.
 * @augments Agent
 */
export class ZeroShotAgent extends Agent {
    constructor(input) {
        super(input);
    }
    _agentType() {
        return "zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    static validateTools(tools) {
        const invalidTool = tools.find((tool) => !tool.description);
        if (invalidTool) {
            const msg = `Got a tool ${invalidTool.name} without a description.` +
                ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    /**
     * Create prompt in the style of the zero shot agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.inputVariables - List of input variables the final prompt will expect.
     */
    static createPrompt(tools, args) {
        const { prefix = PREFIX, suffix = SUFFIX, inputVariables = ["input", "agent_scratchpad"], } = args ?? {};
        const toolStrings = tools
            .map((tool) => `${tool.name}: ${tool.description}`)
            .join("\n");
        const toolNames = tools.map((tool) => tool.name).join("\n");
        const instructions = formatInstructions(toolNames);
        const template = [prefix, toolStrings, instructions, suffix].join("\n\n");
        return new PromptTemplate({
            template,
            inputVariables,
        });
    }
    static fromLLMAndTools(llm, tools, args) {
        ZeroShotAgent.validateTools(tools);
        const prompt = ZeroShotAgent.createPrompt(tools, args);
        const chain = new LLMChain({ prompt, llm });
        return new ZeroShotAgent({
            llmChain: chain,
            allowedTools: tools.map((t) => t.name),
        });
    }
    async extractToolAndInput(text) {
        if (text.includes(FINAL_ANSWER_ACTION)) {
            const parts = text.split(FINAL_ANSWER_ACTION);
            const input = parts[parts.length - 1].trim();
            return { tool: "Final Answer", input };
        }
        const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
        if (!match) {
            throw new Error(`Could not parse LLM output: ${text}`);
        }
        return {
            tool: match[1].trim(),
            input: match[2].trim().replace(/^"+|"+$/g, ""),
        };
    }
    static async deserialize(data) {
        const { llm, tools, ...rest } = data;
        return deserializeHelper(llm, tools, rest, (llm, tools, args) => ZeroShotAgent.fromLLMAndTools(llm, tools, {
            prefix: args.prefix,
            suffix: args.suffix,
            inputVariables: args.input_variables,
        }), (args) => new ZeroShotAgent(args));
    }
}
//# sourceMappingURL=index.js.map