import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const queueGroup = "orders-service-queue-group";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe("ticket:created", queueGroup);

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`);
    }
  });
});
