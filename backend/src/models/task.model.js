import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Assigned",
        "Accepted",
        "Working",
        "Completed",
        "Verified",
        "Rejected",
      ],
      default: "Assigned",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    deadline: {
      type: Date,
      default: null,
    },

    adminRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    workerRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  assignedTo: 1,
  status: 1,
});

taskSchema.index({
  complaint: 1,
});

export default mongoose.model("Task", taskSchema);