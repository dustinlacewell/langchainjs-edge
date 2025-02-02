import { Example } from "../../schema/index.js";
import type { BaseExampleSelector } from "../base.js";
import { PromptTemplate } from "../prompt.js";
interface LengthBasedExampleSelectorArgs {
    examplePrompt: PromptTemplate;
    maxLength?: number;
    getTextLength?: (text: string) => number;
}
export declare class LengthBasedExampleSelector implements BaseExampleSelector {
    protected examples: Example[];
    examplePrompt: PromptTemplate;
    getTextLength: (text: string) => number;
    maxLength: number;
    exampleTextLengths: number[];
    constructor(data: LengthBasedExampleSelectorArgs);
    addExample(example: Example): Promise<void>;
    calculateExampleTextLengths(v: number[], values: LengthBasedExampleSelector): Promise<number[]>;
    selectExamples(inputVariables: Example): Promise<Example[]>;
    static fromExamples(examples: Example[], args: LengthBasedExampleSelectorArgs): Promise<LengthBasedExampleSelector>;
}
export {};
