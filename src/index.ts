import dotenv from "dotenv";
dotenv.config();
import _ from "lodash";
global._ = _;
import databaseConfig from "./config/database";
databaseConfig.connectToMongo();
databaseConfig.connectToRedis();
import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import cors from "cors";
import routes from './routes';
import { poolChatHandler } from "./socket/chatting";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger-output.json";

const PORT = process.env.PORT || 5000;
const app = express(); // create app instance from express

app.use(express.json());
app.use(cors()); // use cors middle

// Routes
app.use('/api', routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // swagger documentation page

const server = http.createServer(app); // create server instance
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

io.on('connection', (socket)=>{
    console.log('user is connected');

    poolChatHandler(socket);

    socket.on('disconnect', ()=>{
        console.log('user is disconnected');
    })
})

//  Server connection is established
server.listen(PORT, ()=>{
    console.log(`Server start on ${PORT} PORT`);
});