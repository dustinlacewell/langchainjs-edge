import { Agent } from "./agent.js";
import { loadFromHub } from "../util/hub.js";
import { loadFromFile, parseFileConfig } from "../util/index.js";
const loadAgentFromFile = async (file, path, llmAndTools) => {
    const serialized = parseFileConfig(file, path);
    return Agent.deserialize({ ...serialized, ...llmAndTools });
};
export const loadAgent = async (uri, llmAndTools) => {
    const hubResult = await loadFromHub(uri, loadAgentFromFile, "agents", new Set(["json", "yaml"]), llmAndTools);
    if (hubResult) {
        return hubResult;
    }
    return loadFromFile(uri, loadAgentFromFile, llmAndTools);
};
//# sourceMappingURL=load.js.map