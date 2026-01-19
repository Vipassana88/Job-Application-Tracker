import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import { requireAuth } from "../middleware/auth.js";
import { createJobSchema, updateJobSchema } from "../validators/job.validators.js";

const router = express.Router();

router.use(requireAuth);

// Create
router.post("/", async (req, res) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const data = parsed.data;
  const job = await Job.create({
    userId: req.user.id,
    ...data,
    appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
  });

  res.status(201).json(job);
});

// List with filters + pagination
router.get("/", async (req, res) => {
  const { status, q, page = "1", limit = "10" } = req.query;

  const filter = { userId: req.user.id };
  if (status && ["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
    filter.status = status;
  }
  if (q) {
    const re = new RegExp(String(q), "i");
    filter.$or = [{ company: re }, { role: re }, { location: re }];
  }

  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Job.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// Get one
router.get("/:id", async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });
  if (!job) return res.status(404).json({ message: "Not found" });
  res.json(job);
});

// Update
router.patch("/:id", async (req, res) => {
  const parsed = updateJobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const update = { ...parsed.data };
  if (update.appliedDate) update.appliedDate = new Date(update.appliedDate);

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true }
  );

  if (!job) return res.status(404).json({ message: "Not found" });
  res.json(job);
});

// Delete
router.delete("/:id", async (req, res) => {
  const deleted = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

// Dashboard stats
router.get("/stats/summary", async (req, res) => {
  const userObjectId = new mongoose.Types.ObjectId(req.user.id);

  const stats = await Job.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const map = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  for (const s of stats) map[s._id] = s.count;

  res.json({ ...map, total: Object.values(map).reduce((a, b) => a + b, 0) });
});

export default router;
