import { Ticket } from "../ticket";

it("Implements optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "21312",
    price: 10,
    userId: "123",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 15 });
  secondInstance?.set({ price: 20 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (error) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "21312",
    price: 10,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
