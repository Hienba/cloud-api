import mongooose from "mongoose";
import User from "../models/user.js";
import { validationResult } from "express-validator";
export const checkProductData = async (req, res, next) => {
  const errors = [];
  for (const key in req.body) {
    if (!req.body[key]) {
      errors.push(`Please add product ${key}.`);
    }
  }
  if (errors.length > 0) return res.status(401).json({ msg: errors });

  next();
};
export const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
