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
router.post("/home/:companyName", async function (req, res) {
  try {
    console.log("hello");
    const { companyName } = req.params; // Get company name from the route parameters
    const updatedDetails = req.body; // Get updated details from the request body

    // Find the startup by company name in the kyc object and update its details
    const startup = await StartupModel.findOneAndUpdate(
      { "kyc.company_name": companyName }, // Search inside the 'kyc' field
      {
        $set: {
          "kyc.company_name": updatedDetails.company_name,
          "kyc.address": updatedDetails.address,
          "kyc.company_details": {
            industry: updatedDetails.company_details.industry,
            website: updatedDetails.company_details.website,
            incorporation_date: updatedDetails.company_details.incorporation_date,
            pan_number: updatedDetails.company_details.pan_number,
            about: updatedDetails.company_details.about,
          },
          "kyc.contact_person": {
            name: updatedDetails.contact_person.name,
            email: updatedDetails.contact_person.email,
            phone: updatedDetails.contact_person.phone,
          },
        },
      },
      { new: true } // Return the updated document
    );

    // If no startup is found, send a 404 response
    if (!startup) {
      console.log("ho");
      console.log(companyName);
      return res.status(404).json({ message: 'Startup not found with the given company name' });
    }

    // Send the updated startup details as a response
    res.status(200).json({
      message: 'Startup details updated successfully',
      updatedStartup: startup,
    });
  } catch (err) {
    console.error('Error updating startup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
