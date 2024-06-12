"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (result) => ({
    status: true,
    result,
    error: null,
});
exports.successResponse = successResponse;
const errorResponse = (error) => ({
    status: false,
    result: null,
    error,
});
exports.errorResponse = errorResponse;
