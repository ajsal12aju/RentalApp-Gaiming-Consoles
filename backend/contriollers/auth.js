
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  try {
    // Extract user data from request body
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      contactNumber,
      userType, // Assuming userType is provided in the request body
    } = req.body;

    // Check if required fields are provided
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

    // Check if userType is 'Seller' and email ends with '@admin.com'
    if (userType === "Seller" && !email.endsWith("@admin.com")) {
      return res.status(400).json({
        message:
          "Sellers can only register with an email address ending with @admin.com",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hash,
      firstName,
      lastName,
      contactNumber,
      userType,
      // Assuming isSeller is set based on userType
      isSeller: userType === "Seller",
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user data and token
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
// export const register = async (req, res, next) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       firstName,
//       lastName,
//       contactNumber,
//       userType,
//     } = req.body;
//     if (
//       !username ||
//       !email ||
//       !password ||
//       !firstName ||
//       !lastName ||
//       !contactNumber ||
//       !userType
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields." });
//     }

//     if (userType === "Seller" && !email.endsWith("@admin.com")) {
//       return res
//         .status(400)
//         .json({
//           message:
//             "Sellers can only register with an email address ending with @admin.com",
//         });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({
//           message: "Email already exists. Please use a different email.",
//         });
//     }

//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);
//     const newUser = new User({
//       username,
//       email,
//       password: hash,
//       firstName,
//       lastName,
//       contactNumber,
//       userType,
//     });
//     await newUser.save();

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({
//       userId: newUser._id,
//       username: newUser.username,
//       email: newUser.email,
//       firstName: newUser.firstName,
//       lastName: newUser.lastName,
//       contactNumber: newUser.contactNumber,
//       userType: newUser.userType,
//       token: token,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide username and password." });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid username or password." });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid username or password." });
//     }

//     const token = jwt.sign(
//       { userId: user._id, userType: user.userType },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.status(200).json({
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       contactNumber: user.contactNumber,
//       userType: user.userType,
//       token: token,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
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

    console.log(user, "====user=====");
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