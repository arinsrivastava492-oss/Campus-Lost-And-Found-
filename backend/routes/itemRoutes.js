// routes/itemRoutes.js
// -----------------------------------------------------------------------
// Maps item-related URLs to their controller functions.
// -----------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} = require("../controllers/itemController");

const { protect } = require("../middleware/auth");

// IMPORTANT: "/mine" must be declared BEFORE "/:id".
// Otherwise Express would treat "mine" as if it were an :id value.
router.get("/mine", protect, getMyItems);

router.get("/", getItems); // anyone can browse items
router.get("/:id", getItemById); // anyone can view one item's details

router.post("/", protect, createItem); // must be logged in to post
router.put("/:id", protect, updateItem); // must be logged in + own the post
router.delete("/:id", protect, deleteItem); // must be logged in + own the post

module.exports = router;
