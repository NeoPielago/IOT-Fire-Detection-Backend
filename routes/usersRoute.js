import express from "express";
const router = express.Router();
import { body } from "express-validator";

import {
  registerUser,
  logout,
  getUser,
  updateUser,
  getUsers,
  login,
  getAdmins,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const containsLetterAndNumber = (value) =>
  /[a-zA-Z]/.test(value) && /\d/.test(value);

//GEhttp://localhost:3000/api/user
router.get("/getUsers", protect, getUsers);

router.get("/getUser", protect, getUser);

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .toLowerCase()
      .withMessage("Must be a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length must be greater than 8 characters")
      .custom(containsLetterAndNumber)
      .withMessage("Password must contain letters and numbers"),
  ],
  registerUser
);

router.put("/update", updateUser);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .toLowerCase()
      .withMessage("Must be a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length must be greater than 8 characters")
      .custom(containsLetterAndNumber)
      .withMessage("Password must contain letters and numbers"),
  ],
  login
);
router.post("/logout", logout);
router.get("/admins", getAdmins);

export default router;
