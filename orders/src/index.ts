import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener, TicketUpdatedListener } from "./events";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Missing env var JWT_KEY");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Missing env var MONGO_URI");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Missing env var NATS_CLIENT_ID");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Missing env var NATS_CLUSTER_ID");
  }
  if (!process.env.NATS_URL) {
    throw new Error("Missing env var NATS_URL");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
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
