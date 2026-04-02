const express = require("express");
const router = express.Router();

const Department = require("../db/models/Department");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          msg: "Department name is required"
        });
      }

      const existing = await Department.findOne({ name });

      if (existing) {
        return res.status(409).json({
          msg: "Department already exists"
        });
      }

      const department = await Department.create({ name });

      res.status(201).json({
        msg: "Department created successfully",
        department
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "Internal Server Error"
      });
    }
  }
);

router.get(
  "/all",
  authMiddleware,
  async (req, res) => {
    try {
      const departments = await Department.find();

      res.json({
        departments
      });

    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    }
  }
);


router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({
          msg: "Department not found"
        });
      }

      res.json({ department });

    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    }
  }
);


router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const { name } = req.body;

      const department = await Department.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );

      if (!department) {
        return res.status(404).json({
          msg: "Department not found"
        });
      }

      res.json({
        msg: "Department updated",
        department
      });

    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    }
  }
);


router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);

      if (!department) {
        return res.status(404).json({
          msg: "Department not found"
        });
      }

      res.json({
        msg: "Department deleted successfully"
      });

    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    }
  }
);

module.exports = router;