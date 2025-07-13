import express from "express";
import bcrypt from "bcrypt";
import { db } from "./models/db.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const id = uuid();
  try {
    await db.run("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)", [id, email, hash]);
    req.session.userId = id;
    res.redirect("/profile.html");
  } catch {
    res.status(400).send("Signup failed. Email might be taken.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return res.send("Invalid login");
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.send("Invalid login");
  req.session.userId = user.id;
  res.redirect("/profile.html");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login.html"));
});

export default router;
