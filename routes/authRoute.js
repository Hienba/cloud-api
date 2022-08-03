import express from "express";
import { body } from "express-validator";
import { verifyToken } from "../controllers/token.js";
import { validate } from "../middleware/validate.js";
import User from "../models/user.js";

import {
  register,
  activate,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/user.js";

const router = express.Router();

router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("email").isEmail().withMessage("Email must be valid."),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("Confirm password must be at least 8 characters long."),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("Username already exists.");
      }
    });
  }),
  validate,
  register
);
router.post("/activate", activate);
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  login
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email must be valid"),
  validate,
  forgotPassword
);
router.post(
  "/reset-password",
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validate,
  resetPassword
);
router.post("/verify", verifyToken, (req, res) => {
  res.status(200).json({
    msg: "Token verified",
  });
});

export default router;
