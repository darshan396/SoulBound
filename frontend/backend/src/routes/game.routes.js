import express from "express";

const router = express.Router();

// Retrieve game state
router.get("/:id", (req, res) => {
  res.status(501).json({
    message: "Get game state not implemented yet.",
    gameId: req.params.id,
  });
});

// Submit a gameplay action, such as playing a card
router.post("/:id/actions", (req, res) => {
  res.status(501).json({
    message: "Game action not implemented yet.",
    gameId: req.params.id,
  });
});

export default router;