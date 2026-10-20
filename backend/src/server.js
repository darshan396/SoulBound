import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userDataRoute from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import gameRoutes from "./routes/game.routes.js";
import rulesRoutes from "./routes/rules.routes.js";

const PORT = 5050;
const app = express();

app.use(express.json());

// Authentication
app.use("/api/auth", authRoutes);

// User data
app.use("/api/user", userDataRoute);

// Private game rooms
app.use("/api/rooms", roomRoutes);

// Gameplay
app.use("/api/games", gameRoutes);

// Game rules
app.use("/api/rules", rulesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Soulbound backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port number ${PORT}`);
});