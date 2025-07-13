import express from "express";
import { db } from "./models/db.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.userId) return res.status(401).send("Not logged in");
  next();
});

router.get("/", async (req, res) => {
  const rows = await db.all(
    `SELECT r.*, ur.status FROM user_resources ur
     JOIN resources r ON r.id = ur.resource_id
     WHERE ur.user_id = ?`, [req.session.userId]
  );
  res.json(rows);
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.run(
    `INSERT INTO user_resources (user_id, resource_id, status)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, resource_id) DO UPDATE SET status = excluded.status`,
    [req.session.userId, id, status]
  );
  res.send("Updated");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM user_resources WHERE user_id = ? AND resource_id = ?", [req.session.userId, id]);
  res.send("Removed");
});

export default router;
