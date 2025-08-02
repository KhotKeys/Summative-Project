import db from "../models/index.js";

export const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Your database connection has been established successfully.");
  } catch (error) {
    console.error(
      "Seem there is an issue, you are unable to connect to the database:",
      error
    );
    process.exit(1);
  }
};
