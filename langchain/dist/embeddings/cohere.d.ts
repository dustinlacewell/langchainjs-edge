import { Embeddings, EmbeddingsParams } from "./base.js";
interface ModelParams {
    modelName: string;
}
/**
 * A class for generating embeddings using the Cohere API.
 */
export declare class CohereEmbeddings extends Embeddings implements ModelParams {
    modelName: string;
    /**
     * The maximum number of documents to embed in a single request. This is
     * limited by the Cohere API to a maximum of 96.
     */
    batchSize: number;
    private apiKey;
    private client;
    /**
     * Constructor for the CohereEmbeddings class.
     * @param fields - An optional object with properties to configure the instance.
     */
    constructor(fields?: EmbeddingsParams & Partial<ModelParams> & {
        verbose?: boolean;
        batchSize?: number;
        apiKey?: string;
    });
    /**
     * Generates embeddings for an array of texts.
     * @param texts - An array of strings to generate embeddings for.
     * @returns A Promise that resolves to an array of embeddings.
     */
    embedDocuments(texts: string[]): Promise<number[][]>;
    /**
     * Generates an embedding for a single text.
     * @param text - A string to generate an embedding for.
     * @returns A Promise that resolves to an array of numbers representing the embedding.
     */
    embedQuery(text: string): Promise<number[]>;
    /**
     * Generates embeddings with retry capabilities.
     * @param request - An object containing the request parameters for generating embeddings.
     * @returns A Promise that resolves to the API response.
     */
    private embeddingWithRetry;
    /**
     * Initializes the Cohere client if it hasn't been initialized already.
     */
    private maybeInitClient;
    /**
     * Dynamically imports the required dependencies for the CohereEmbeddings class.
     * @returns An object containing the imported cohere-ai module.
     * @throws An error if the cohere-ai dependency is not installed.
     */
    static imports(): Promise<{
        cohere: typeof import("cohere-ai");
    }>;
}
export {};
