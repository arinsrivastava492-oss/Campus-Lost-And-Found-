// models/Item.js
// -----------------------------------------------------------------------
// Defines what a "Lost & Found Item" post looks like in the database.
// -----------------------------------------------------------------------

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Electronics", "Documents", "Accessories", "Bags", "Clothing", "Keys", "Other"],
      default: "Other",
    },
    // "lost"  -> someone lost this item and is looking for it
    // "found" -> someone found this item and is holding it for the owner
    status: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    location: {
      type: String, // e.g. "Library, 2nd floor" or "Canteen"
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: Date, // the date the item was lost or found
      required: true,
    },
    imageUrl: {
      type: String, // optional link to a photo of the item
      default: "",
    },
    // Whether the item has been claimed / reunited with its owner
    resolved: {
      type: Boolean,
      default: false,
    },
    // Link back to the user who created this post
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A text index lets us run fast keyword searches across title/description
itemSchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Item", itemSchema);
