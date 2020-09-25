import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Missing env var JWT_KEY");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connect to DB");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Listening on 3000!!!");
  });
};

start();
