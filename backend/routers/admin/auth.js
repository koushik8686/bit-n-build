const express = require('express');
const router = express.Router();
const Startup = require('.../models/startupmodel');
const EIR = require('.../models/EirSchema'); // Update with your EIR model path
const GrantScheme = require('.../models/GrandSchemeSchema');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username , password);
    try {
      // Find user by username
      if (username == "admin" && password == "12345") {
       return res.status(200).send({ message: 'Login successful' });
      }
      res.status(200).send({ message: 'Wrong Credentials' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  router.get('/Startups', async (req, res) => {
    try {
      // Fetch all startups and only the required fields
      const startups = await Startup.find({}, {
        'kyc.company_name': 1,
        'kyc.company_details.industry': 1,
        'grants.grant_application.status': 1,
      });
  
      // Format the data for the response
      const responseData = startups.map(startup => ({
        name: startup.kyc.company_name,  // Name field
        industry: startup.kyc.company_details.industry || 'N/A',  // Industry field
        status: startup.grants.length > 0 ? startup.grants[0].grant_application.status : 'No Application',  // Grant Status
        action: 'View'  // Placeholder for the action fi (eldYou can modify this)
      }));
  
      // Send the formatted data
      res.status(200).json(responseData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });


// GET request to fetch EIR details
//   router.get('/eir', async (req, res) => {
//   try {
//     const eirRequests = await EIR.find();
//     res.status(200).json(eirRequests);
//   } catch (error) {
//     console.error('Error fetching EIR requests:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.get('/eir', async (req, res) => {
  try {
    const eirRequests = await EIR.find(); // Exclude the _id field
    res.status(200).json(eirRequests); // Send the fetched records as a JSON response
  } catch (error) {
    console.error('Error fetching EIR requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/grant-request', async (req, res) => {
  try {
    // Fetch all grant requests from the GrantScheme collection
    const grantRequests = await GrantScheme.find().select('-_id'); // Exclude the _id field

    // Send the fetched records as a JSON response
    res.status(200).json(grantRequests);
  } catch (error) {
    console.error('Error fetching grant requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router
auth.js