const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  salary: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  document: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedByMaker: { type: Boolean, default: false },
});

module.exports = mongoose.model("Lead", leadSchema);
