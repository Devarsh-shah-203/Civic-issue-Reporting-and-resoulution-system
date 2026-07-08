import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Road",
        "Water",
        "Electricity",
        "Garbage",
        "Drainage",
        "Street Light",
        "Traffic",
        "Public Property",
        "Other",
      ],
    },

    images: [
      {
        public_id: {
          type: String,
        //  required: true,
        },
        url: {
          type: String,
          //required: true,
        },
      },
    ],

    location: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
      },

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          //required: true,
        },
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     // required: true,
      
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.virtual("upvoteCount").get(function () {
  return this.upvotes.length;
});

complaintSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

complaintSchema.index({
  title: "text",
  description: "text",
});

complaintSchema.index({
  category: 1,
  status: 1,
});

complaintSchema.index({
  priority: 1,
});

complaintSchema.index({
  createdBy: 1,
});

complaintSchema.index({
  createdAt: -1,
});

complaintSchema.index({
  "location.coordinates": "2dsphere",
});

complaintSchema.set("toJSON", {
  virtuals: true,
});

complaintSchema.set("toObject", {
  virtuals: true,
});

export default mongoose.model("Complaint", complaintSchema);