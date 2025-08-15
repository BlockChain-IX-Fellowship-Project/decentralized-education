import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get user by wallet address
router.get("/:walletAddress", async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create or update user
router.post("/", async (req, res) => {
  const { walletAddress, name, email, bio } = req.body;
  if (!walletAddress) return res.status(400).json({ message: "Wallet address required" });
  try {
    let user = await User.findOne({ walletAddress });
    if (user) {
      user.name = name;
      user.email = email;
      if (typeof bio === 'string') user.bio = bio;
      await user.save();
      return res.json(user);
    }
    user = new User({ walletAddress, name, email, bio });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
