const express = require('express');
const router = express.Router();
const User = require("../../models/usermodel");
const StartupModel = require("../../models/startupmodel");
const EIR = require("../../models/EirSchema");  // Assuming you named your EIR model file as eirmodel.js
const GrantScheme = require("../../models/GrandSchemeSchema"); // Assuming you named your Grant model file as grantschememodel.js

router.get("/home/:user/:startup", async function (req, res) {
  try {
    // Find user
    const user = await User.findById(req.params.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find startup
    const startup = await StartupModel.findById(req.params.startup);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Search in EIR collection
    const eirRecords = await EIR.find({ startup_id: req.params.startup });
    // Search in GrantScheme collection
    const grantRecords = await GrantScheme.find({ "startup_id": req.params.startup });

    // Send response with user, startup, eirRecords, and grantRecords
    res.status(200).send({
      user,
      startup,
      eirRecords,
      grantRecords
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
