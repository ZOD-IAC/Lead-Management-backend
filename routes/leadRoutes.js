const express = require("express");
const multer = require("multer");
const Lead = require("../models/Lead");
const userModel = require("../models/user");
const { checkRole } = require("../middleware/isLoggedIn");
const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

//User Routes
router.post(
  "/",
  checkRole("user"),
  upload.single("document"),
  async (req, res) => {
    try {
      const { name, email, salary, loanAmount } = req.body;
      const newLead = await Lead.create({
        name,
        email,
        salary,
        loanAmount,
        document: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
      });

      res.status(201).json({ message: "Lead created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding lead" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().select("-password");
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leads" });
  }
});

//Maker Routes
router.get("/get-users", checkRole("maker"), async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(
      users.filter((item) => {
        return item.name !== req.user.name;
      })
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.patch("/:id/change-role/:role", checkRole("maker"), async (req, res) => {
  const { id, role } = req.params;
  try {
    const users = await userModel
      .findByIdAndUpdate({ _id: id }, { role })
      .select("-password");
    res.status(200).json({ message: "Role changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.patch("/:id/approve", checkRole("maker"), async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findByIdAndUpdate(id, {
      approvedByMaker: true,
    });

    res.status(200).json({ lead, message: "approved" });
  } catch (error) {
    res.status(500).json({ error: "Error approving lead" });
  }
});

router.patch("/:id/reject", checkRole("maker"), async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByIdAndUpdate(id, {
      approvedByMaker: false,
    });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: "Error approving lead" });
  }
});

//Checker Routes
router.get("/checker-leads", checkRole("checker"), async (req, res) => {
  try {
    const leads = await Lead.find();
    const filterLeads = leads.filter((item) => {
      return item.approvedByMaker == true;
    });
    res.status(200).json(filterLeads);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leads" });
  }
});

router.patch(
  "/checker-leads/:id/approve",
  checkRole("checker"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const lead = await Lead.findByIdAndUpdate(id, {
        status: "approved",
      });

      res.status(200).json({ lead, message: "approved" });
    } catch (error) {
      res.status(500).json({ error: "Error approving lead" });
    }
  }
);

router.patch(
  "/checker-leads/:id/reject",
  checkRole("checker"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const lead = await Lead.findByIdAndUpdate(id, {
        status: "rejected",
      });
      res.status(200).json(lead);
    } catch (error) {
      res.status(500).json({ error: "Error approving lead" });
    }
  }
);

module.exports = router;
