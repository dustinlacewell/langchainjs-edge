import { BaseRetriever } from "../schema/index.js";
export class VectorStoreRetriever extends BaseRetriever {
    constructor(fields) {
        super();
        Object.defineProperty(this, "vectorStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4
        });
        this.vectorStore = fields.vectorStore;
        this.k = fields.k ?? this.k;
    }
    async getRelevantDocuments(query) {
        const results = await this.vectorStore.similaritySearch(query, 4);
        return results;
    }
}
export class VectorStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(embeddings, _dbConfig) {
        Object.defineProperty(this, "embeddings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embeddings = embeddings;
    }
    async similaritySearch(query, k = 4, filter = undefined) {
        const results = await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k, filter);
        return results.map((result) => result[0]);
    }
    async similaritySearchWithScore(query, k = 4, filter = undefined) {
        return this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k, filter);
    }
    static fromTexts(_texts, _metadatas, _embeddings, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _dbConfig) {
        throw new Error("the Langchain vectorstore implementation you are using forgot to override this, please report a bug");
    }
    static fromDocuments(_docs, _embeddings, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _dbConfig) {
        throw new Error("the Langchain vectorstore implementation you are using forgot to override this, please report a bug");
    }
    asRetriever(k) {
        return new VectorStoreRetriever({ vectorStore: this, k });
    }
}
export class SaveableVectorStore extends VectorStore {
    static load(_directory, _embeddings) {
        throw new Error("Not implemented");
    }
}
//# sourceMappingURL=base.js.map