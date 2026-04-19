import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    /**
     * / Query CORE AI with a conversation history.
     * / messages: array of { role: "user" | "assistant"; content: Text }
     * / Returns the AI response text or an error message string.
     */
    queryAI(messages: Array<{
        content: string;
        role: string;
    }>): Promise<string>;
    /**
     * / Update the OpenRouter API key. Only callable by canister controllers.
     */
    setApiKey(key: string): Promise<void>;
}
