import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Users from "../model/userModel.js";
import Admins from "../model/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  console.log("token", token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await Users.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token!");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  console.log("token", token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await Admins.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401).json({
          error:
            "Unauthorised, your user access level does not meet the requirements of this endpoint.",
        });
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token!");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

export { protect, protectAdmin };
