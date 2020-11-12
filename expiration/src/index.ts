import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Missing env var NATS_CLIENT_ID");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Missing env var NATS_CLUSTER_ID");
  }
  if (!process.env.NATS_URL) {
    throw new Error("Missing env var NATS_URL");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("Missing env var REDIS_HOST");
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
  } catch (error) {
    console.log(error);
  }
};

start();
