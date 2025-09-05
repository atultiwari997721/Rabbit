import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Special admin login
    if (email === "atultiwari997721@gmail.com" && password === "123456") {
      let adminUser = await User.findOne({ email });
      if (!adminUser) {
        // Create admin user if not exists
        const hashedPassword = await bcrypt.hash(password, 10);
        adminUser = await User.create({
          name: "Admin User",
          email,
          password: hashedPassword,
          isAdmin: true,
        });
      }
      const token = jwt.sign(
        { id: adminUser._id, isAdmin: true },
        process.env.JWT_SECRET
      );
      return res.json({ token, user: adminUser });
    }
    // Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
