import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import "./notification-system/notificationWorker.js";
import { startNotificationScheduler } from "./notification-system/scheduler.js";

const PORT = process.env.PORT || 3000;

const runServer = async () => {
  await connectDB();
  await connectRedis();

  // Start notification system
  startNotificationScheduler();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
runServer();
