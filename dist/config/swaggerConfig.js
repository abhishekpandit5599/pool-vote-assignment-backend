"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: 'Pooling System API',
        description: 'API documentation for the Pooling System project',
    },
    host: 'localhost:5000/api',
    schemes: ['http'],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts']; // adjust the path as necessary
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
