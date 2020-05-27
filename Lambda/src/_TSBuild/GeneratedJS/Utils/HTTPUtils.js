"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const HTTPReturn_1 = require("../Models/HTTPReturn");
const Return = {
    Ok: function (Body = "", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 200, Body, Headers);
    },
    Created: function (Body = "Entity(ies) Created", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 201, Body, Headers);
    },
    NoContent: function (Body = "", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 204, Body, Headers);
    },
    BadReq: function (Body = "Invalid Request", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 400, Body, Headers);
    },
    NotFound: function (Body = "", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 404, Body, Headers);
    },
    Error: function (Body = "Internal Server Error", Headers = {}, IsBase64Encoded = false) {
        return new HTTPReturn_1.HTTPReturn(IsBase64Encoded, 500, Body, Headers);
    }
};
exports.Return = Return;
