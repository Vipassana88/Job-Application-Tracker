import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  location: z.string().max(120).optional().or(z.literal("")),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]).optional(),
  appliedDate: z.string().optional(), // ISO string
  link: z.string().max(300).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const updateJobSchema = createJobSchema.partial();
