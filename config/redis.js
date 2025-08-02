import { createClient } from "redis";
import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();

let redisClient = null;
let notificationQueue = null;
let complianceQueue = null;

// Only initialize Redis if REDIS_URL is configured
if (process.env.REDIS_URL) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    // Bull queues using Redis URL
    notificationQueue = new Queue(
      "notifications",
      process.env.REDIS_URL
    );
    complianceQueue = new Queue("compliance", process.env.REDIS_URL);
  } catch (error) {
    console.warn("Redis initialization failed:", error.message);
  }
} else {
  console.warn("REDIS_URL not configured. Redis functionality disabled.");
}

const connectRedis = async () => {
  if (!redisClient) {
    console.warn("Redis client not initialized. Skipping Redis connection.");
    return;
  }
  
  try {
    await redisClient.connect();
    console.log("Redis connected successfully.");
  } catch (error) {
    console.warn("Redis connection failed:", error.message);
    console.warn("Application will continue without Redis.");
  }
};

export { redisClient, connectRedis, notificationQueue, complianceQueue };
