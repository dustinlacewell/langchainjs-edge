import jsonpointer from "jsonpointer";
import { TextLoader } from "./text.js";
export class JSONLoader extends TextLoader {
    constructor(filePathOrBlob, pointers = []) {
        super(filePathOrBlob);
        Object.defineProperty(this, "pointers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.pointers = Array.isArray(pointers) ? pointers : [pointers];
    }
    async parse(raw) {
        const json = JSON.parse(raw.trim());
        // If there is no pointers specified we extract all strings we found
        const extractAllStrings = !(this.pointers.length > 0);
        const compiledPointers = this.pointers.map((pointer) => jsonpointer.compile(pointer));
        return this.extractArrayStringsFromObject(json, compiledPointers, extractAllStrings);
    }
    /**
     * If JSON pointers are specified, return all strings below any of them
     * and exclude all other nodes expect if they match a JSON pointer (to allow to extract strings from different levels)
     *
     * If no JSON pointer is specified then return all string in the object
     */
    extractArrayStringsFromObject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json, pointers, extractAllStrings = false, keyHasBeenFound = false) {
        if (!json) {
            return [];
        }
        if (typeof json === "string" && extractAllStrings) {
            return [json];
        }
        if (Array.isArray(json) && extractAllStrings) {
            let extractedString = [];
            for (const element of json) {
                extractedString = extractedString.concat(this.extractArrayStringsFromObject(element, pointers, true));
            }
            return extractedString;
        }
        if (typeof json === "object") {
            if (extractAllStrings) {
                return this.extractArrayStringsFromObject(Object.values(json), pointers, true);
            }
            const targetedEntries = this.getTargetedEntries(json, pointers);
            const thisLevelEntries = Object.values(json);
            const notTargetedEntries = thisLevelEntries.filter((entry) => !targetedEntries.includes(entry));
            let extractedStrings = [];
            // If we found a targeted entry, we extract all strings from it
            if (targetedEntries.length > 0) {
                for (const oneEntry of targetedEntries) {
                    extractedStrings = extractedStrings.concat(this.extractArrayStringsFromObject(oneEntry, pointers, true, true));
                }
                for (const oneEntry of notTargetedEntries) {
                    extractedStrings = extractedStrings.concat(this.extractArrayStringsFromObject(oneEntry, pointers, false, true));
                }
            }
            else if (extractAllStrings || !keyHasBeenFound) {
                for (const oneEntry of notTargetedEntries) {
                    extractedStrings = extractedStrings.concat(this.extractArrayStringsFromObject(oneEntry, pointers, extractAllStrings));
                }
            }
            return extractedStrings;
        }
        return [];
    }
    getTargetedEntries(json, pointers) {
        const targetEntries = [];
        for (const pointer of pointers) {
            const targetedEntry = pointer.get(json);
            if (targetedEntry) {
                targetEntries.push(targetedEntry);
            }
        }
        return targetEntries;
    }
}
//# sourceMappingURL=json.js.map