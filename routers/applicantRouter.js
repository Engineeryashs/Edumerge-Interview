const express = require("express");
const router = express.Router();

const Program = require("../models/Program");
const Applicant = require("../models/Applicant");

const { authMiddleware, roleMiddleware } = require("../middlewares/auth");


router.post(
  "/applicant/create",
  authMiddleware,
  roleMiddleware(["OFFICER"]),
  async (req, res) => {
    try {
      const applicant = await Applicant.create(req.body);
      res.json(applicant);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);



router.post(
  "/allocate-seat",
  authMiddleware,
  roleMiddleware(["OFFICER"]),
  async (req, res) => {
    try {
      const { applicantId, programId, quotaType } = req.body;

      const program = await Program.findById(programId);
      if (!program) {
        return res.status(404).json({ msg: "Program not found" });
      }

      const quota = program.quotas.find(q => q.type === quotaType);
      if (!quota) {
        return res.status(404).json({ msg: "Quota not found" });
      }

      
      if (quota.filledSeat >= quota.seats) {
        return res.status(400).json({ msg: "Quota full" });
      }

      quota.filledSeat += 1;
      await program.save();

     
      const applicant = await Applicant.findByIdAndUpdate(
        applicantId,
        {
          programId,
          quotaType,
          status: "Allocated"
        },
        { new: true }
      );

      res.json({
        msg: "Seat allocated successfully",
        applicant
      });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);




router.post(
  "/confirm-admission",
  authMiddleware,
  roleMiddleware(["OFFICER"]),
  async (req, res) => {
    try {
      const { applicantId } = req.body;

      const applicant = await Applicant.findById(applicantId);
      if (!applicant) {
        return res.status(404).json({ msg: "Applicant not found" });
      }

      // 🚨 Fee check
      if (applicant.feeStatus !== "Paid") {
        return res.status(400).json({ msg: "Fee not paid" });
      }

      if (applicant.status === "Confirmed") {
        return res.status(400).json({ msg: "Already confirmed" });
      }

      // 🔢 Generate admission number
      const count = await Applicant.countDocuments({
        programId: applicant.programId,
        quotaType: applicant.quotaType,
        status: "Confirmed"
      });

      const admissionNumber = `INST/2026/UG/${applicant.quotaType}/${String(count + 1).padStart(4, "0")}`;

      applicant.admissionNumber = admissionNumber;
      applicant.status = "Confirmed";

      await applicant.save();

      res.json({
        msg: "Admission confirmed",
        admissionNumber
      });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);



router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["ADMIN", "MANAGEMENT"]),
  async (req, res) => {
    try {
      const programs = await Program.find();

      let totalIntake = 0;
      let totalFilled = 0;

      const quotaStats = {};

      programs.forEach(program => {
        totalIntake += program.intake;

        program.quotas.forEach(q => {
          totalFilled += q.filledSeat;

          if (!quotaStats[q.type]) {
            quotaStats[q.type] = { filled: 0, total: 0 };
          }

          quotaStats[q.type].filled += q.filledSeat;
          quotaStats[q.type].total += q.seats;
        });
      });

      res.json({
        totalIntake,
        totalFilled,
        remaining: totalIntake - totalFilled,
        quotaStats
      });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);



router.post(
  "/mark-fee-paid",
  authMiddleware,
  roleMiddleware(["OFFICER"]),
  async (req, res) => {
    try {
      const { applicantId } = req.body;

      const applicant = await Applicant.findByIdAndUpdate(
        applicantId,
        { feeStatus: "Paid" },
        { new: true }
      );

      res.json(applicant);

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

module.exports = router;