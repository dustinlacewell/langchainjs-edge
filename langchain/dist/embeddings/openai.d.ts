import { ConfigurationParameters } from "openai-edge";
import { Embeddings, EmbeddingsParams } from "./base.js";
interface ModelParams {
    modelName: string;
}
export declare class OpenAIEmbeddings extends Embeddings implements ModelParams {
    modelName: string;
    /**
     * The maximum number of documents to embed in a single request. This is
     * limited by the OpenAI API to a maximum of 2048.
     */
    batchSize: number;
    /**
     * Whether to strip new lines from the input text. This is recommended by
     * OpenAI, but may not be suitable for all use cases.
     */
    stripNewLines: boolean;
    private client;
    private clientConfig;
    constructor(fields?: Partial<ModelParams> & EmbeddingsParams & {
        verbose?: boolean;
        batchSize?: number;
        openAIApiKey?: string;
        stripNewLines?: boolean;
    }, configuration?: ConfigurationParameters);
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
    private embeddingWithRetry;
}
export {};
