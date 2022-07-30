import CryptoJS from "crypto-js";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const token = jsonwebtoken.sign(
      {
        username,
        password,
        email,
      },
      process.env.REGISTER_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const activate = async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
      const decoded = jsonwebtoken.verify(
        token,
        process.env.REGISTER_SECRET_KEY
      );
      const { username, password, email } = decoded;
      const user = await User.findOne({ username });
      if (user) {
        return res.status(401).json({ msg: "User already exists" });
      }
      if (!user) {
        const newUser = new User({
          username,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.ENCRYPT_SECRET_KEY
          ).toString(),
          email,
        });
        await newUser.save();
        res.status(200).json({ msg: "User created." });
      } else {
        res.status(401).json({ msg: "User already exists." });
      }
    } else {
      return res.status(401).json({ msg: "Invalid token." });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ msg: "User not found." });
    }
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.ENCRYPT_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return res.status(401).json({ msg: "Invalid password." });
    }
    const token = jsonwebtoken.sign(
      {
        username,
        password,
        email: user.email,
      },
      process.env.LOGIN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      msg: "User logged successfully",
      username,
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
