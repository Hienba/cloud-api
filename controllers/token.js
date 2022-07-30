import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";

const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = jsonwebtoken.verify(
        bearer,
        process.env.LOGIN_SECRET_KEY
      );
      return tokenDecoded;
    } catch (error) {
      return false;
    }
  }
};
export const verifyToken = (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecode) {
    const user = User.findById(tokenDecode.id);
    if (!user) {
      res.status(401).json({
        msg: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } else {
    res.status(401).json({
      msg: "Unauthorized",
    });
  }
};
