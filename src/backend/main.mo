import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  // ── State ──────────────────────────────────────────────────────────────────
  var apiKey : Text = "";

  // ── IC Management Canister (HTTP outcalls) ────────────────────────────────
  type HttpHeader = { name : Text; value : Text };
  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    method : { #get; #head; #post };
    headers : [HttpHeader];
    body : ?Blob;
    transform : ?{
      function : shared query ({ response : HttpResponse; context : Blob }) -> async HttpResponse;
      context : Blob;
    };
    is_replicated : ?Bool;
  };
  type HttpResponse = {
    status : Nat;
    headers : [HttpHeader];
    body : Blob;
  };
  type IC = actor {
    http_request : HttpRequestArgs -> async HttpResponse;
  };

  let ic : IC = actor "aaaaa-aa";

  // ── System prompt ─────────────────────────────────────────────────────────
  let systemPrompt : Text =
    "You are CORE AI, the intelligent fitness assistant for CORE Theory Library — " #
    "a comprehensive fitness platform with 50+ exercises across 8 categories: " #
    "Upper Body, Lower Body, Core, Cardio, Flexibility, Strength, Balance, and Mobility.\n\n" #
    "Your role is STRICTLY limited to answering questions about:\n" #
    "- Nutrition and meal planning (macros, calories, meal timing, supplements, hydration)\n" #
    "- Diet strategies (weight loss, muscle gain, maintenance, specific diets)\n" #
    "- Exercise technique, programming, and fitness goals\n" #
    "- Recovery, rest, and injury prevention related to fitness\n\n" #
    "If a user asks about ANYTHING outside these topics (politics, history, coding, general knowledge, " #
    "entertainment, relationships, etc.), politely decline and redirect them back to nutrition, " #
    "diet, or exercise topics. Say something like: " #
    "I am CORE AI, specialised in nutrition, diet, and fitness. I cannot help with that topic, " #
    "but I would love to answer any questions about your workout plan, meal prep, or exercise technique!";

  // ── JSON helpers ──────────────────────────────────────────────────────────
  func escapeJson(s : Text) : Text {
    var result = s;
    result := result.replace(#text "\\", "\\\\");
    result := result.replace(#char '\"', "\\\"");
    result := result.replace(#char '\n', "\\n");
    result := result.replace(#char '\r', "\\r");
    result := result.replace(#char '\t', "\\t");
    result
  };

  func buildRequestBody(messages : [{ role : Text; content : Text }]) : Text {
    var msgsJson = "{\"role\":\"system\",\"content\":\"" # escapeJson(systemPrompt) # "\"}";
    for (msg in messages.vals()) {
      let role = if (msg.role == "assistant") "assistant" else "user";
      msgsJson #= ",{\"role\":\"" # escapeJson(role) # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    "{\"model\":\"mistralai/mistral-7b-instruct\",\"messages\":[" # msgsJson # "],\"max_tokens\":800,\"temperature\":0.7}"
  };

  // Extract the value of the first "content":"..." key in a JSON string.
  // Strategy: split on the needle, take the second part, then scan until closing quote.
  // Handles basic escape sequences (\n, \r, \t, \", \\).
  func extractContent(json : Text) : ?Text {
    // Split on `"content":"` — if found, the second segment starts right after the opening quote
    let parts = json.split(#text "\"content\":\"");
    var seenFirst = false;
    var found : ?Text = null;
    for (part in parts) {
      if (not seenFirst) {
        seenFirst := true;
      } else if (found == null) {
        // Scan until unescaped closing quote
        var result = "";
        var escaped = false;
        var done = false;
        for (c in part.toIter()) {
          if (not done) {
            if (escaped) {
              result #= if (c == 'n') "\n"
                         else if (c == 'r') "\r"
                         else if (c == 't') "\t"
                         else Text.fromChar(c);
              escaped := false;
            } else if (c == '\\') {
              escaped := true;
            } else if (c == '\"') {
              done := true;
            } else {
              result #= Text.fromChar(c);
            };
          };
        };
        found := ?(if (done) result else "");
      };
    };
    found
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Update the OpenRouter API key. Only callable by canister controllers.
  public shared ({ caller }) func setApiKey(key : Text) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: only controllers can set the API key");
    };
    apiKey := key;
  };

  /// Query CORE AI with a conversation history.
  /// messages: array of { role: "user" | "assistant"; content: Text }
  /// Returns the AI response text or an error message string.
  public shared func queryAI(messages : [{ role : Text; content : Text }]) : async Text {
    if (apiKey == "") {
      return "CORE AI is not configured yet. Please contact the platform administrator.";
    };

    let body = buildRequestBody(messages);
    let bodyBlob = body.encodeUtf8();

    let requestArgs : HttpRequestArgs = {
      url = "https://openrouter.ai/api/v1/chat/completions";
      max_response_bytes = ?10_000;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # apiKey },
        { name = "HTTP-Referer"; value = "https://core-theory-library.ic0.app" },
        { name = "X-Title"; value = "CORE Theory Library" },
      ];
      body = ?bodyBlob;
      transform = null;
      is_replicated = ?false;
    };

    // HTTP outcalls require cycles — attach 220B for the call
    let response = try {
      await (with cycles = 220_000_000_000) ic.http_request(requestArgs);
    } catch (_) {
      return "Error: Failed to reach CORE AI. Please try again later.";
    };

    if (response.status < 200 or response.status >= 300) {
      return "Error: AI service returned status " # response.status.toText() # ". Please try again later.";
    };

    switch (response.body.decodeUtf8()) {
      case null "Error: Could not decode AI response.";
      case (?responseText) {
        switch (extractContent(responseText)) {
          case null "Error: Could not parse AI response.";
          case (?content) content;
        };
      };
    }
  };
};
