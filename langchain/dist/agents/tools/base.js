import { getCallbackManager } from "../../callbacks/index.js";
const getVerbosity = () => false;
export class Tool {
    constructor(verbose, callbackManager) {
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "callbackManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnDirect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.verbose = verbose ?? getVerbosity();
        this.callbackManager = callbackManager ?? getCallbackManager();
    }
    async call(arg, verbose) {
        const _verbose = verbose ?? this.verbose;
        await this.callbackManager.handleToolStart({ name: this.name }, arg, _verbose);
        let result;
        try {
            result = await this._call(arg);
        }
        catch (e) {
            await this.callbackManager.handleToolError(e, _verbose);
            throw e;
        }
        await this.callbackManager.handleToolEnd(result, _verbose);
        return result;
    }
}
//# sourceMappingURL=base.js.map