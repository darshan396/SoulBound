import express from "express";
const router = express.Router();

router.get("/me", (req , res) => {
    res.status(500).json({
        message : "Fetching user data not implemented yet.",
    });
});

export default router;