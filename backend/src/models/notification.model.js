import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     // required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    type: {
      type: String,
      //required: true,
      enum: [
        "Complaint Created",
        "Complaint Assigned",
        "Complaint Updated",
        "Status Changed",
        "Complaint Resolved",
        "Complaint Rejected",
        "New Comment",
        "New Upvote",
        "Duplicate Complaint",
        "System",
      ],
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
     // required: true,
      trim: true,
      maxlength: 500,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index for user notifications
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

// Automatically remove old notifications after 90 days
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
  }
);

export default mongoose.model("Notification", notificationSchema);