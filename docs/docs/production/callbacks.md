# Events / Callbacks

LangChain provides a callback system that allows you to hook into the various stages of your LLM application. This is useful for logging, [monitoring](./tracing), [streaming](../modules/models/llms/additional_functionality#streaming-responses), and other tasks.

You can subscribe to these events by using the `callbackManager` argument available throughout the API. A `CallbackManager` is an object that manages a list of `CallbackHandlers`. The `CallbackManager` will call the appropriate method on each handler when the event is triggered.

```typescript
interface CallbackManager {
  addHandler(handler: CallbackHandler): void;

  removeHandler(handler: CallbackHandler): void;

  setHandlers(handlers: CallbackHandler[]): void;

  setHandler(handler: CallbackHandler): void;
}
```

CallbackHandlers are objects that implement the `CallbackHandler` interface, which has a method for each event that can be subscribed to. The `CallbackManager` will call the appropriate method on each handler when the event is triggered.

```typescript
abstract class BaseCallbackHandler {
  handleLLMStart?(
    llm: { name: string },
    prompts: string[],
    verbose?: boolean
  ): Promise<void>;

  handleLLMNewToken?(token: string, verbose?: boolean): Promise<void>;

  handleLLMError?(err: Error, verbose?: boolean): Promise<void>;

  handleLLMEnd?(output: LLMResult, verbose?: boolean): Promise<void>;

  handleChainStart?(
    chain: { name: string },
    inputs: ChainValues,
    verbose?: boolean
  ): Promise<void>;

  handleChainError?(err: Error, verbose?: boolean): Promise<void>;

  handleChainEnd?(outputs: ChainValues, verbose?: boolean): Promise<void>;

  handleToolStart?(
    tool: { name: string },
    input: string,
    verbose?: boolean
  ): Promise<void>;

  handleToolError?(err: Error, verbose?: boolean): Promise<void>;

  handleToolEnd?(output: string, verbose?: boolean): Promise<void>;

  handleText?(text: string, verbose?: boolean): Promise<void>;

  handleAgentAction?(action: AgentAction, verbose?: boolean): Promise<void>;

  handleAgentEnd?(action: AgentFinish, verbose?: boolean): Promise<void>;
}
```

## Using an existing handler

LangChain provides a few built-in handlers that you can use to get started. These are available in the `langchain/callbacks` module. The most basic handler is the `ConsoleCallbackHandler`, which simply logs all events to the console. In the future we will add more default handlers to the library.

```typescript
import { CallbackManager, ConsoleCallbackHandler } from "langchain/callbacks";
import { OpenAI } from "langchain";

const callbackManager = new CallbackManager();
callbackManager.addHandler(new ConsoleCallbackHandler());

const model = new OpenAI({ temperature: 0, callbackManager });
```

## Creating a one-off handler

We offer a method on the `CallbackManager` class that allows you to create a one-off handler. This is useful if eg. you need to create a handler that you will use only for a single request, eg to stream the output of an LLM to a websocket.

```typescript
import { CallbackManager } from "langchain/callbacks";
import { OpenAI } from "langchain";

const callbackManager = CallbackManager.fromHandlers({
  async handleLLMNewToken(token) {
    // do something with the token
  },

  // you could add some of the other methods above if you wanted to
});

const model = new OpenAI({
  temperature: 0,
  callbackManager,
});
```

## Creating a custom handler

You can also create your own handler by implementing the `CallbackHandler` interface. This is useful if you want to do something more complex than just logging to the console, eg. send the events to a logging service. As an example here is the implementation of the `ConsoleCallbackHandler`:

```typescript
export class MyCallbackHandler extends BaseCallbackHandler {
  async handleChainStart(chain: { name: string }) {
    console.log(`Entering new ${chain.name} chain...`);
  }

  async handleChainEnd(_output: ChainValues) {
    console.log("Finished chain.");
  }

  async handleAgentAction(action: AgentAction) {
    console.log(action.log);
  }

  async handleToolEnd(output: string) {
    console.log(output);
  }

  async handleText(text: string) {
    console.log(text);
  }

  async handleAgentEnd(action: AgentFinish) {
    console.log(action.log);
  }
}
```

You could then use it as described in the [section](#using-an-existing-handler) above.
