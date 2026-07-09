import mongoose from "mongoose";

const workReportSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Approved",
        "Rejected",
      ],
      default: "Submitted",
    },

    adminRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

workReportSchema.index({
  worker: 1,
  status: 1,
});

workReportSchema.index({
  complaint: 1,
});

export default mongoose.model(
  "WorkReport",
  workReportSchema
);