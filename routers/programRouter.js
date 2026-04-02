const express = require("express");
const router = express.Router();

const Program = require("../db/models/Program");
const Department = require("../db/models/Department");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");



router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const {
        name,
        code,
        departmentId,
        courseType,
        academicYear,
        inTake,
        quotas
      } = req.body;

   
      if (!name || !departmentId || !inTake || !quotas) {
        return res.status(400).json({ msg: "Missing required fields" });
      }

    
      const dept = await Department.findById(departmentId);
      if (!dept) {
        return res.status(404).json({ msg: "Department not found" });
      }

    let total = 0;

quotas.forEach(q => {
  total += q.seats;
});
      if (total !== inTake) {
        return res.status(400).json({
          msg: "Total quota seats must equal intake"
        });
      }
      const types = quotas.map(q => q.type);
      if (new Set(types).size !== types.length) {
        return res.status(400).json({
          msg: "Duplicate quota types not allowed"
        });
      }

      const formattedQuotas = quotas.map(q => ({
        type: q.type,
        seats: q.seats,
        filledSeat: 0
      }));

      const program = await Program.create({
        name,
        code,
        departmentId,
        courseType,
        academicYear,
        inTake,
        quotas: formattedQuotas
      });

      res.status(201).json({
        msg: "Program created successfully",
        program
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);