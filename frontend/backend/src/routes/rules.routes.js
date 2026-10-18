import express from "express";

const router = express.Router();

// Retrieve Soulbound game rules
router.get("/", (req, res) => {
  res.status(501).json({
    message: "Game rules not implemented yet.",
  });
});

export default router;