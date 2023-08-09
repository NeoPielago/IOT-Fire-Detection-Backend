import asyncHandler from "express-async-handler";
import Users from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import Admins from "../model/adminModel.js";

//create new user
//POST api/user/create
const registerUser = asyncHandler(async (req, res) => {
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
      message: "User created successfully",
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
  const { email, ...updateFields } = req.body;
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { email: email.toLowerCase() },
      updateFields,
      {
        new: true,
      }
    );

    if (updatedUser) {
      res.status(200).json({ user: updatedUser });
    } else {
      res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    res.status(400).json({ error: `Error updating user: ${error}` });
  }
});

//private

const getUsers = asyncHandler(async (req, res) => {
  const documents = await Users.find({});

  res.status(200).json({ users: documents });
  //only admins can request users, ADMIN
});

//private
const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminExists = await Admins.findOne({ email: email.toLowerCase() });

  if (adminExists)
    res.json({ error: `Admin with the email ${email} already exists` });

  try {
    const admin = await Admins.create({
      firstName,
      lastName,
      email,
      password,
    });

    console.log(admin);

    if (admin) {
      generateToken(res, admin.id);
      console.log(res.cookie);
      res.status(201).json({
        message: "admin created successfully",
        status: 201,
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      });
    } else {
      throw new Error("Invalid User Data");
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out!" });
});

const login = asyncHandler(async (req, res) => {
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
      //message: "successfully logged in"
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

const getAdmins = asyncHandler(async (req, res) => {
  const documents = await Admins.find({});

  res.status(200).json({ admins: documents });
});

const getAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const admin = await Admins.findOne({ email: email.toLowerCase() });

  if (admin) {
    res.status(200).json({
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
    });
  } else {
    return res.status(200).json({ error: "Admin not found." });
  }
});

export {
  registerUser,
  logout,
  getUser,
  updateUser,
  getUsers,
  login,
  registerAdmin,
  getAdmins,
  getAdmin,
};
