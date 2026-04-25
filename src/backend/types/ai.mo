/// Types for CORE AI HTTP outcall integration.
module {
  public type HttpHeader = { name : Text; value : Text };

  public type HttpRequestArgs = {
    url               : Text;
    max_response_bytes : ?Nat64;
    method            : { #get; #head; #post };
    headers           : [HttpHeader];
    body              : ?Blob;
    transform         : ?{
      function : shared query ({ response : HttpResponse; context : Blob }) -> async HttpResponse;
      context  : Blob;
    };
    is_replicated : ?Bool;
  };

  public type HttpResponse = {
    status  : Nat;
    headers : [HttpHeader];
    body    : Blob;
  };
};
