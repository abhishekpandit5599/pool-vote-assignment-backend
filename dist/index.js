"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const lodash_1 = __importDefault(require("lodash"));
global._ = lodash_1.default;
const database_1 = __importDefault(require("./config/database"));
database_1.default.connectToMongo();
database_1.default.connectToRedis();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const chatting_1 = require("./socket/chatting");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./config/swagger-output.json"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)(); // create app instance from express
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // use cors middle
// Routes
app.use('/api', routes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default)); // swagger documentation page
const server = http_1.default.createServer(app); // create server instance
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('user is connected');
    (0, chatting_1.poolChatHandler)(socket);
    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});
//  Server connection is established
server.listen(PORT, () => {
    console.log(`Server start on ${PORT} PORT`);
});
