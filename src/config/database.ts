import mongoose from "mongoose";
import Redis from "ioredis";
import _ from "lodash";

type Environment = "local" | "staging" | "production";

const databaseConfig = {
  local: process.env.MONGODB_LOCAL_URL || "",
  staging: process.env.MONGODB_STAGING_URL || "",
  production: process.env.MONGODB_PRODUCTION_URL || "",

  localRedis: process.env.REDIS_LOCAL_URL || "",
  stagingRedis: process.env.REDIS_STAGING_URL || "",
  productionRedis: process.env.REDIS_PRODUCTION_URL || "",

  async connectToMongo(): Promise<void> {
    const env: string = process.env.NODE_ENV || "local";
    let mongoUrl: string;
    if (env === "local") {
      mongoUrl = this.local;
    } else if (env === "staging") {
      mongoUrl = this.staging;
    } else if (env === "production") {
      mongoUrl = this.production;
    } else {
      console.error("Invalid NODE_ENV value");
      return;
    }

    try {
      const result = await mongoose.connect(mongoUrl);
      if (_.isEmpty(result)) {
        console.log("Database not connected");
      } else {
        console.log("Database connected successfully.");
      }
    } catch (error) {
      console.log("Error connecting to database:", error);
    }
  },

  connectToRedis(): Redis {
    const env: Environment = (process.env.NODE_ENV as Environment) || "local";

    let redisUrl: string;

    if (env === "local") {
      redisUrl = this.localRedis;
    } else if (env === "staging") {
      redisUrl = this.stagingRedis;
    } else if (env === "production") {
      redisUrl = this.productionRedis;
    } else {
      throw new Error("Invalid NODE_ENV value");
    }

    const redis = new Redis(redisUrl);

    redis.on("connect", () => {
      console.log("Redis connected successfully.");
    });

    redis.on("error", (error) => {
      console.error("Error connecting to Redis:", error);
    });

    return redis;
  },
};

export default databaseConfig;
