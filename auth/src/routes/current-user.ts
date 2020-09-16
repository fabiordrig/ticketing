import express from "express";

const router = express.Router();

router.get("/api/users/currentUser", (req, res) => {
  res.send("Oiiiii FUnFOU FDP");
});

export { router as currentUserRouter };
