import express from "express";

const router = express.Router();

// Create a private room
router.post("/", (req, res) => {
  res.status(501).json({
    message: "Create room not implemented yet.",
  });
});

// Join a room using an invite code
router.post("/join", (req, res) => {
  res.status(501).json({
    message: "Join room not implemented yet.",
  });
});

// Get room status
router.get("/:id", (req, res) => {
  res.status(501).json({
    message: "Get room status not implemented yet.",
    roomId: req.params.id,
  });
  
});

// Start when both players are ready
router.post("/:id/start", (req, res) => {
  res.status(501).json({
    message: "Start game not implemented yet.",
    roomId: req.params.id,
  });
});

export default router;