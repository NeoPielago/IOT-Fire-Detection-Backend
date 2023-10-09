import mongoose from "mongoose";

const deviceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, //check this, you might be missing reference.
      required: true,
    },
    macAddress: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Devices = mongoose.model("Devices", deviceSchema);
export default Devices;
