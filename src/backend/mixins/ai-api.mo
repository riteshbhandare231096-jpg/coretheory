import AiTypes "../types/ai";
import AiLib "../lib/ai";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

/// Public API surface for the CORE AI HTTP outcall integration (ungated).
/// State is injected by main.mo.
mixin (state : { var apiKey : Text }) {

  // ── IC Management Canister (HTTP outcalls) ─────────────────────────────────
  type IC = actor {
    http_request : AiTypes.HttpRequestArgs -> async AiTypes.HttpResponse;
  };
  let ic : IC = actor "aaaaa-aa";

  /// Update the OpenRouter API key. Only callable by canister controllers.
  public shared ({ caller }) func setApiKey(key : Text) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: only controllers can set the API key");
    };
    state.apiKey := key;
  };

  /// Internal helper: make a single HTTP outcall with a specified max_tokens override.
  func callOpenRouter(
    messages  : [{ role : Text; content : Text }],
    maxTokens : Nat,
  ) : async Text {
    // Build request body with the given token limit
    let body = AiLib.buildRequestBody(AiLib.systemPrompt(), messages).replace(
      #text "\"max_tokens\":1500",
      "\"max_tokens\":" # maxTokens.toText(),
    );
    let bodyBlob = body.encodeUtf8();

    let requestArgs : AiTypes.HttpRequestArgs = {
      url               = "https://openrouter.ai/api/v1/chat/completions";
      max_response_bytes = ?20_000;
      method            = #post;
      headers           = [
        { name = "Content-Type";  value = "application/json" },
        { name = "Authorization"; value = "Bearer " # state.apiKey },
        { name = "HTTP-Referer";  value = "https://coretheory.ic0.app" },
        { name = "X-Title";       value = "coretheory" },
      ];
      body          = ?bodyBlob;
      transform     = null;
      is_replicated = ?false;
    };

    let response = try {
      await (with cycles = 260_000_000_000) ic.http_request(requestArgs);
    } catch (_) {
      return "";
    };

    if (response.status < 200 or response.status >= 300) {
      return "";
    };

    switch (response.body.decodeUtf8()) {
      case null "";
      case (?t) t;
    };
  };

  /// Returns true if `s` ends with a sentence-terminating character,
  /// meaning the response appears complete rather than truncated.
  func looksComplete(s : Text) : Bool {
    let trimmed = s.trimEnd(#text " ");
    if (trimmed == "") return false;
    trimmed.endsWith(#text ".") or
    trimmed.endsWith(#text "!") or
    trimmed.endsWith(#text "?") or
    trimmed.endsWith(#text ":") or
    trimmed.endsWith(#text ")") or
    trimmed.endsWith(#text "*") or
    trimmed.endsWith(#text "-")
  };

  /// Query CORE AI directly (no tier gating). Used internally; also kept for
  /// backward compatibility. Prefer queryAIGated for tier-aware calls.
  public shared func queryAI(
    messages : [{ role : Text; content : Text }],
  ) : async Text {
    if (state.apiKey == "") {
      return "CORE AI is not configured yet. Please contact the platform administrator.";
    };

    if (messages.size() == 0) {
      return "Please send a message to CORE AI.";
    };

    // First attempt at 1500 tokens
    let rawResponse = await callOpenRouter(messages, 1500);

    if (rawResponse == "") {
      return "CORE AI is temporarily unavailable. Please try again in a moment.";
    };

    // Check for API-level error in JSON body (e.g. {"error": ...})
    if (rawResponse.contains(#text "\"error\"") and not rawResponse.contains(#text "\"choices\"")) {
      return "CORE AI is experiencing an issue. Please try again in a moment.";
    };

    let firstContent = AiLib.extractContent(rawResponse);

    switch (firstContent) {
      case null {
        "I could not generate a response right now. Please rephrase your question and try again."
      };
      case (?content) {
        if (content == "") {
          return "I received an empty response. Please try asking your question again.";
        };

        // If the response looks truncated, retry with 2500 tokens
        if (not looksComplete(content)) {
          let retryResponse = await callOpenRouter(messages, 2500);
          if (retryResponse != "" and retryResponse.contains(#text "\"choices\"")) {
            switch (AiLib.extractContent(retryResponse)) {
              case (?retryContent) {
                if (retryContent != "") return retryContent;
              };
              case null {};
            };
          };
          // Retry failed or also incomplete — return what we have with a note
          content # " (Note: response may have been cut short — try a more specific question for a complete answer.)"
        } else {
          content
        };
      };
    };
  };
};
