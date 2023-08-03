import asyncHandler from "express-async-handler";
import Users from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";
import { Collection } from "mongo";

//create new user
//POST api/user/create
const registerUser = asyncHandler(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ error });

  const {
    firstName,
    lastName,
    contactNo,
    email,
    streetName,
    barangay,
    city,
    password,
  } = req.body;

  const userExist = await Users.findOne({ email: email.toLowerCase() });

  if (userExist) {
    console.log(true);
    throw new Error("User already exists");
  }

  const user = await Users.create({
    firstName,
    lastName,
    contactNo,
    streetName,
    barangay,
    city,
    email,
    password,
  });

  console.log(user);

  if (user) {
    generateToken(res, user.id);
    res.status(201).json({
      status: 201,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    throw new Error("Invalid user data");
  }
});

//private
const getUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Please provide email" });

  const user = await Users.findOne({ email: email.toLowerCase() });

  if (user)
    return res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      contactNo: user.contactNo,
      address: {
        streetName: user.streetName,
        barangay: user.barangay,
        city: user.city,
      },
    });

  return res.status(200).json({ error: "user not found" });
});

//private
const updateUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Update User" });
});

//private

const getUsers = asyncHandler(async (req, res) => {
  const documents = await Users.find({});

  res.status(200).json({ users: documents });

  // res.status(200).json({ message: "get Users" });
});

//private
const getAdmins = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "get admins" });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out!" });
});

const login = asyncHandler(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(400).json({ error });

  const { email, password } = req.body;
  const user = await Users.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user.id);
    res.status(201).json({
      status: 201,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

export {
  registerUser,
  logout,
  getUser,
  updateUser,
  getUsers,
  login,
  getAdmins,
};
