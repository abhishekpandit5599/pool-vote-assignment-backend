"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const lodash_1 = __importDefault(require("lodash"));
const databaseConfig = {
    local: process.env.MONGODB_LOCAL_URL || "",
    staging: process.env.MONGODB_STAGING_URL || "",
    production: process.env.MONGODB_PRODUCTION_URL || "",
    localRedis: process.env.REDIS_LOCAL_URL || "",
    stagingRedis: process.env.REDIS_STAGING_URL || "",
    productionRedis: process.env.REDIS_PRODUCTION_URL || "",
    connectToMongo() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = process.env.NODE_ENV || "local";
            let mongoUrl;
            if (env === "local") {
                mongoUrl = this.local;
            }
            else if (env === "staging") {
                mongoUrl = this.staging;
            }
            else if (env === "production") {
                mongoUrl = this.production;
            }
            else {
                console.error("Invalid NODE_ENV value");
                return;
            }
            try {
                const result = yield mongoose_1.default.connect(mongoUrl);
                if (lodash_1.default.isEmpty(result)) {
                    console.log("Database not connected");
                }
                else {
                    console.log("Database connected successfully.");
                }
            }
            catch (error) {
                console.log("Error connecting to database:", error);
            }
        });
    },
    connectToRedis() {
        const env = process.env.NODE_ENV || "local";
        let redisUrl;
        if (env === "local") {
            redisUrl = this.localRedis;
        }
        else if (env === "staging") {
            redisUrl = this.stagingRedis;
        }
        else if (env === "production") {
            redisUrl = this.productionRedis;
        }
        else {
            throw new Error("Invalid NODE_ENV value");
        }
        const redis = new ioredis_1.default(redisUrl);
        redis.on("connect", () => {
            console.log("Redis connected successfully.");
        });
        redis.on("error", (error) => {
            console.error("Error connecting to Redis:", error);
        });
        return redis;
    },
};
exports.default = databaseConfig;
