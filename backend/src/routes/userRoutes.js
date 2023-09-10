import express from "express";
import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken";
const router = express.Router()

router.get("/", (req, res) => {
  res.status(200);
  res.send("User page");
});

router.post("/signup", async (req, res) => {
  try {
    const reqBody = await req.body;
    const { username, email, password } = reqBody;

    console.log(reqBody);

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send verification email

    //await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return res.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const reqBody = await req.body;
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.log("error.message", error.message);
    return res.status(500).json({ error: error.message });
  }
});



export default router