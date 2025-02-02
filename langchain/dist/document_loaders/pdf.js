import { Document } from "../document.js";
import { BufferLoader } from "./buffer.js";
export class PDFLoader extends BufferLoader {
    constructor(filePathOrBlob, { splitPages = true } = {}) {
        super(filePathOrBlob);
        Object.defineProperty(this, "splitPages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.splitPages = splitPages;
    }
    async parse(raw, metadata) {
        const { getDocument, version } = await PDFLoaderImports();
        const pdf = await getDocument({
            data: new Uint8Array(raw.buffer),
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
        }).promise;
        const meta = await pdf.getMetadata().catch(() => null);
        const documents = [];
        for (let i = 1; i <= pdf.numPages; i += 1) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const text = content.items
                .map((item) => item.str)
                .join("\n");
            documents.push(new Document({
                pageContent: text,
                metadata: {
                    ...metadata,
                    pdf: {
                        version,
                        info: meta?.info,
                        metadata: meta?.metadata,
                        totalPages: pdf.numPages,
                    },
                    loc: {
                        pageNumber: i,
                    },
                },
            }));
        }
        if (this.splitPages) {
            return documents;
        }
        return [
            new Document({
                pageContent: documents.map((doc) => doc.pageContent).join("\n\n"),
                metadata: {
                    ...metadata,
                    pdf: {
                        version,
                        info: meta?.info,
                        metadata: meta?.metadata,
                        totalPages: pdf.numPages,
                    },
                },
            }),
        ];
    }
}
async function PDFLoaderImports() {
    try {
        const { default: mod } = await import("pdfjs-dist");
        const { getDocument, version } = mod;
        return { getDocument, version };
    }
    catch (e) {
        console.error(e);
        throw new Error("Failed to load pdfjs-dist. Please install it with eg. `npm install pdfjs-dist`.");
    }
}
//# sourceMappingURL=pdf.js.map