import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: 1213,
    title: "bla",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("event publish");
  });
});
