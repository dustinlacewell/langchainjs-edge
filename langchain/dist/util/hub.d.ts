import { FileLoader, LoadValues } from "./index.js";
export declare const loadFromHub: <T>(uri: string, loader: FileLoader<T>, validPrefix: string, validSuffixes: Set<string>, values?: LoadValues) => Promise<T>;
