"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPReturn = void 0;
class HTTPReturn {
    constructor(IsBase64Encoded, StatusCode, Body, Headers, MultiValueHeaders = {}) {
        let parsedBody = Body;
        if (typeof parsedBody !== "string")
            parsedBody = JSON.stringify(Body);
        this.isBase64Encoded = IsBase64Encoded;
        this.statusCode = StatusCode;
        this.body = parsedBody;
        this.headers = Headers;
        this.multiValueHeaders = MultiValueHeaders;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.HTTPReturn = HTTPReturn;
