import express from "express";
const router = express.Router();

import {
  validateUpdateInput,
  validateRegistration,
  validateLogin,
  validateGetUser,
  validateAdminReg,
  validateGetAdmin,
} from "../middleware/validator.js";

import {
  registerUser,
  logout,
  getUser,
  updateUser,
  getUsers,
  login,
  registerAdmin,
  getAdmins,
  getAdmin,
} from "../controller/userController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

//GEhttp://localhost:3000/api/user
router.get("/getUsers", protect, getUsers);

router.get("/getUser", protect, validateGetUser, getUser);

router.post("/register", validateRegistration, registerUser);

router.patch("/update", validateUpdateInput, protect, updateUser);

router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/admin/register", validateAdminReg, registerAdmin);
router.get("/admin/getAdmins", protectAdmin, getAdmins);
router.get("/admin/getAdmin", validateGetAdmin, protectAdmin, getAdmin);

export default router;
