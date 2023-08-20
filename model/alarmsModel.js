import mongoose from "mongoose";

const alarmSchema = mongoose.Schema(
  {
    gas: {
      type: Number,
      required: true,
    },
    fire: {
      type: Number,
      required: true,
    },
    alarmCode: {
      type: String,
      required: true,
      enum: ["low", "moderate", "high"],
    },
    macAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Alarms = mongoose.model("Alarms", alarmSchema);

export default Alarms;
