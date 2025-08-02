import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import NotificationModel from "./notification.js";

import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Dynamically import all model files
const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js");

for (const file of files) {
  const fullPath = pathToFileURL(path.join(__dirname, file)).href;
  const { default: defineModel } = await import(fullPath);
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}


db.Notification = NotificationModel(sequelize, DataTypes);

// Set up associations for existing models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
