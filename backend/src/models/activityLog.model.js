import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "Complaint Created",
        "Complaint Updated",
        "Complaint Deleted",
        "Complaint Assigned",
        "Status Changed",
        "Priority Changed",
        "Comment Added",
        "Comment Updated",
        "Comment Deleted",
        "Upvoted",
        "Duplicate Marked",
        "Complaint Resolved",
        "Complaint Reopened",
      ],
    },

    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    device: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Complaint Timeline
activityLogSchema.index({
  complaint: 1,
  createdAt: -1,
});

// User Activity
activityLogSchema.index({
  performedBy: 1,
  createdAt: -1,
});

// Action Analytics
activityLogSchema.index({
  action: 1,
});

export default mongoose.model("ActivityLog", activityLogSchema);