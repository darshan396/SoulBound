import express from "express";
const router = express.Router();

router.post("/register", (req , res) => {
    res.status(500).json({
        message : "Registration not implemented yet.",
        data: req.body
    });
});

router.post("/login", (req , res) => {
    res.status(500).json({
        message : "Login not implemented yet.",
    });
});

router.post("/logout", (req , res) => {
    res.status(500).json({
        message : "Logout not implemented yet.",
    });
});

export default router;