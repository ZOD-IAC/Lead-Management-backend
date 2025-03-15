const express = require("express");
const userModel = require("../models/user");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not exists" });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      res.status(404).json({ message: "Incorrect Email or password" });
    }
    if (check) {
      let token = generateToken(user);
      res.status(200).json({ message: "login successful", token, user });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({
      message: "Something Went wrong",
    });
  }
};

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const isFirstUser = (await userModel.countDocuments()) === 0;
    const role = isFirstUser ? "maker" : "user";

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPass,
      role,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: "User registered successfully",
      //   token,
      //   user: { id: newUser._id, name: newUser.name, email: newUser.email, role },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({
      message: "Something Went wrong",
    });
  }
};
