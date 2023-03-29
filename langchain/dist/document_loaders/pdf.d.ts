/// <reference types="node" resolution-mode="require"/>
import { Document } from "../document.js";
import { BufferLoader } from "./buffer.js";
export declare class PDFLoader extends BufferLoader {
    private splitPages;
    constructor(filePathOrBlob: string | Blob, { splitPages }?: {
        splitPages?: boolean;
    });
    parse(raw: Buffer, metadata: Document["metadata"]): Promise<Document[]>;
}
