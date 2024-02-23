
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      contactNumber,
      userType, 
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !contactNumber ||
      !userType
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (userType === "Seller" && !email.endsWith("@admin.com")) {
      return res.status(400).json({
        message:
          "Sellers can only register with an email address ending with @admin.com",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
      firstName,
      lastName,
      contactNumber,
      userType,
      isSeller: userType === "Seller",
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      contactNumber: newUser.contactNumber,
      userType: newUser.userType,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    console.log(user, "====user======");
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        userId: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        userType: user.userType,
        token: token,
      });
  } catch (err) {
    next(err);
  }
};