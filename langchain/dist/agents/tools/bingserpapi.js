import { Tool } from "./base.js";
class BingSerpAPI extends Tool {
    constructor(apiKey = process.env.BingApiKey, params = {}) {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "bing-search"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "a search engine. useful for when you need to answer questions about current events. input should be a search query."
        });
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!apiKey) {
            throw new Error("BingSerpAPI API key not set. You can set it as BingApiKey in your .env file.");
        }
        this.key = apiKey;
        this.params = params;
    }
    async _call(input) {
        const headers = { "Ocp-Apim-Subscription-Key": this.key };
        const params = { q: input, textDecorations: "true", textFormat: "HTML" };
        const searchUrl = new URL("https://api.bing.microsoft.com/v7.0/search");
        Object.entries(params).forEach(([key, value]) => {
            searchUrl.searchParams.append(key, value);
        });
        const response = await fetch(searchUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const res = await response.json();
        const myresponse = res.webPages.value[0].snippet;
        return myresponse;
    }
}
export { BingSerpAPI };
//# sourceMappingURL=bingserpapi.js.map