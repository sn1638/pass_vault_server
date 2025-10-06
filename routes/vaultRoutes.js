import express from "express";
import jwt from "jsonwebtoken";
import Vault from "../models/Vault.js";

const router = express.Router();

function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
router.post("/", auth, async (req, res) => {
  try {
    const { title, encryptedData, iv, salt } = req.body;
    
    if (!title?.trim() || !encryptedData || !iv || !salt) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    const vault = await Vault.create({ 
      userId: req.userId, 
      title: title.trim(),
      encryptedData,
      iv,
      salt
    });

    res.status(201).json({
      _id: vault._id,
      title: vault.title
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Invalid data format" });
    }
    res.status(500).json({ message: "Failed to create vault entry" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const items = await Vault.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('title encryptedData iv salt updatedAt');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid entry ID" });
    }
    
    const entry = await Vault.findOne({ _id: id, userId: req.userId })
      .select('title encryptedData iv salt');
    
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch entry" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, encryptedData, iv, salt } = req.body;

    if (!title?.trim() || !encryptedData || !iv || !salt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updated = await Vault.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title: title.trim(), encryptedData, iv, salt },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ 
      _id: updated._id, 
      title: updated.title 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update entry" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Vault.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!result) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete entry" });
  }
});

export default router;