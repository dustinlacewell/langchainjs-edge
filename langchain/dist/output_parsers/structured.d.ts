import { z } from "zod";
import { BaseOutputParser } from "../schema/index.js";
export declare class StructuredOutputParser<T extends z.AnyZodObject> extends BaseOutputParser {
    schema: T;
    constructor(schema: T);
    static fromZodSchema<T extends z.AnyZodObject>(schema: T): StructuredOutputParser<T>;
    static fromNamesAndDescriptions<S extends {
        [key: string]: string;
    }>(schemas: S): StructuredOutputParser<z.ZodObject<{
        [k: string]: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        [x: string]: string;
    }, {
        [x: string]: string;
    }>>;
    getFormatInstructions(): string;
    parse(text: string): Promise<z.infer<T>>;
}
