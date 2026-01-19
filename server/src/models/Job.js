import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120 },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
      index: true,
    },

    appliedDate: { type: Date, default: Date.now },
    link: { type: String, trim: true, maxlength: 300 },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
