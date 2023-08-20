import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admins = mongoose.model("Admins", adminSchema);

export default Admins;
