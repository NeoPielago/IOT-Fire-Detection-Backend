import asyncHandler from "express-async-handler";
import Users from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import Admins from "../model/adminModel.js";
import Alarms from "../model/alarmsModel.js";
import Devices from "../model/devicesModel.js";

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

  try {
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
  } catch (error) {
    res.status(500).json({ error });
  }
});

//private
const getUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
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
  } catch (error) {
    res.status(500).json({ error });
  }
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
  try {
    const documents = await Users.find({});

    res.status(200).json({ users: documents });
    //only admins can request users, ADMIN
  } catch (error) {}
});

//private
const registerAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const adminExists = await Admins.findOne({ email: email.toLowerCase() });

    if (!adminExists)
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
            role: admin.role,
          });
        } else {
          res.status(400).json({ error: "Invalid User Data" });
        }
      } catch (error) {
        res.status(500).json({ error });
      }

    res.json({ error: `Admin with the email ${email} already exists` });
  } catch (error) {
    res.status(500).json({ error });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User logged out!" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email: email.toLowerCase() });
    const admin = await Admins.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user.id);
      res.status(200).json({
        status: 200,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        //message: "successfully logged in"
      });
    } else if (admin && (await admin.matchPassword(password))) {
      generateToken(res, admin.id);
      res.status(200).json({
        status: 200,
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

const getAdmins = asyncHandler(async (req, res) => {
  const documents = await Admins.find({});

  res.status(200).json({ admins: documents });
});

const getAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admins.findOne({ email: email.toLowerCase() });

    if (admin) {
      res.status(200).json({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        isRevoked: admin.isRevoked,
      });
    } else {
      return res.status(200).json({ error: "Admin not found." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

const updateAdmin = asyncHandler(async (req, res) => {
  const { email, isRevoked } = req.body;

  try {
    const admin = await Admins.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isRevoked: isRevoked } },
      {
        new: true,
      }
    );

    if (admin) {
      res.status(200).json({ admin: admin });
    } else {
      res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    res.status(400).json({ error: `Error updating user: ${error}` });
  }
});

const getAlarmHistory = asyncHandler(async (req, res) => {
  const { macAddress, alarmCode } = req.body;

  try {
    if (alarmCode) {
      const alarmHistory = await Alarms.find({ macAddress, alarmCode });

      if (alarmHistory) {
        res.status(200).json({ alarmHistory });
        return;
      } else {
        res.status(500).json({ error: "something went wrong" });
        return;
      }
    }
    const alarmHistory = await Alarms.find({ macAddress });
    res.status(200).json({ alarmHistory });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

const createDevice = asyncHandler(async (req, res) => {
  const { deviceName, macAddress, userId } = req.body;

  try {
    const userIdExists = await Users.findById(userId);
    const macAddressExists = await Devices.findOne({ macAddress });

    if (!userIdExists) {
      return res.status(400).json({ error: "userId does not exist" });
    }

    if (macAddressExists) {
      return res
        .status(400)
        .json({ error: "device cannot be added, it belongs to a user" });
    }
    const newDevice = await Devices.create({
      deviceName,
      macAddress,
      userId,
    });
    res.status(201).json({ newDevice });
    return;
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

const getDevices = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const userIdExists = await Users.findById(userId);

    if (!userIdExists) {
      return res.status(400).json({ error: "UserId does not exist" });
    }

    const devices = await Devices.find({ userId });
    res.status(200).json({ devices });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
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
  updateAdmin,
  getAlarmHistory,
  createDevice,
  getDevices,
};
