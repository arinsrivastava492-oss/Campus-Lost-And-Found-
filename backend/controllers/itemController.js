// controllers/itemController.js
// -----------------------------------------------------------------------
// Contains the logic for creating, reading, updating and deleting
// lost/found item posts (this is the "CRUD" part of the app).
// -----------------------------------------------------------------------

const Item = require("../models/Item");

// -----------------------------------------------------------------------
// @route   GET /api/items
// @desc    Get all items, with optional filtering & search
//          Examples:
//            /api/items?status=lost
//            /api/items?category=Electronics
//            /api/items?search=black+wallet
// @access  Public
// -----------------------------------------------------------------------
async function getItems(req, res) {
  try {
    const { status, category, search, resolved } = req.query;

    const filter = {};
    if (status) filter.status = status; // "lost" or "found"
    if (category) filter.category = category;
    if (resolved !== undefined) filter.resolved = resolved === "true";

    if (search) {
      // Uses the text index we defined on the Item model
      filter.$text = { $search: search };
    }

    const items = await Item.find(filter)
      .populate("postedBy", "name email") // include the poster's name/email
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching items", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   GET /api/items/:id
// @desc    Get a single item by its ID
// @access  Public
// -----------------------------------------------------------------------
async function getItemById(req, res) {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching item", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   POST /api/items
// @desc    Create a new lost/found item post
// @access  Private (must be logged in)
// -----------------------------------------------------------------------
async function createItem(req, res) {
  try {
    const { title, description, category, status, location, date, imageUrl } = req.body;

    if (!title || !description || !status || !location || !date) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const item = await Item.create({
      title,
      description,
      category,
      status,
      location,
      date,
      imageUrl,
      postedBy: req.user._id, // comes from the auth middleware
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating item", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   PUT /api/items/:id
// @desc    Update an item (e.g. mark as resolved, edit details)
// @access  Private (only the original poster can edit)
// -----------------------------------------------------------------------
async function updateItem(req, res) {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Security check: make sure the logged-in user owns this post
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this item" });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document instead of the old one
      runValidators: true,
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating item", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   DELETE /api/items/:id
// @desc    Delete an item post
// @access  Private (only the original poster can delete)
// -----------------------------------------------------------------------
async function deleteItem(req, res) {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting item", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   GET /api/items/mine
// @desc    Get all items posted by the logged-in user
// @access  Private
// -----------------------------------------------------------------------
async function getMyItems(req, res) {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching your items", error: error.message });
  }
}

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
};
