const express = require('express');
const router = express.Router();
const Startup = require('../../models/startupmodel');
const EIR = require('../../models/EirSchema'); // Update with your EIR model path
const GrantScheme = require('../../models/GrandSchemeSchema');
const Messages = require('../../models/adminmessages')
var nodemailer = require('nodemailer');

const senderemail = "hexart637@gmail.com";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderemail,
        pass: 'zetk dsdm imvx keoa'
    }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === 'admin' && password === '12345') {
      return res.status(200).send({ message: 'Login successful' });
    }
    res.status(401).send({ message: 'Wrong Credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get Startups
router.get('/startups', async (req, res) => {
  try {
    const startups = await Startup.find({});
    console.log('Startup request called');
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch startups' });
  }
});

// Get EIR Requests
router.get('/eir-requests', async (req, res) => {
  try {
    const eirRequests = await EIR.find({});
    console.log('EIR request called');
    res.status(200).json(eirRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch EIR requests' });
  }
});

// Get Grant Requests
router.get('/grant-requests', async (req, res) => {
  try {
    const grantRequests = await GrantScheme.find({});
    console.log('Grant request called');
    res.status(200).json(grantRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grant requests' });
  }
});
router.post('/grant/progress', async (req, res) => {
  const { grantId, status } = req.body;

  try {
    // Find the grant request by ID and update its status to "In Progress"
    const updatedGrant = await GrantScheme.findByIdAndUpdate(
      grantId,
      {
        $set: {
          'grant_status.status': status, // Set status to "In Progress"
          'grant_status.decision_date': new Date(), // Set the decision date
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedGrant) {
      return res.status(404).json({ error: 'Grant request not found' });
    }
    console.log('Progress request called');
    const mailOptions = {
      from: senderemail,
      to: updatedGrant.applicant.contact_details.email,
      subject: 'Regarding Grant Request',
      html: `
       <h1> Congrats your grand request has been taken into consideration and we will update the futher details shortly via mail</h1>
      `
  };
  // Send the verification email
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Mail sent successfully to receiver");
      }
  });
    res.status(200).json({ message: 'Grant request marked as In Progress', updatedGrant });
  } catch (error) {
    console.error('Error marking grant request as In Progress:', error);
    res.status(500).json({ error: 'Failed to mark grant request as In Progress' });
  }
});

// Handle Reject Request
router.post('/grant/reject', async (req, res) => {
  const { grantId, status } = req.body;
  try {
    // Find the grant request by ID and update its status
    const updatedGrant = await GrantScheme.findByIdAndUpdate(
      grantId,
      {
        $set: {
          'grant_status.status': status,
          'grant_status.decision_date': new Date(), // Set the decision date
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedGrant) {
      return res.status(404).json({ error: 'Grant request not found' });
    }
    console.log('Reject request called');
    const mailOptions = {
      from: senderemail,
      to: updatedGrant.applicant.contact_details.email,
      subject: 'Rejected Grant Request',
      html: `
       <h1>We Regret To infrom you that your grand request has been declined</h1>
      `
  };
  // Send the verification email
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Mail sent successfully to receiver");
      }
  });
    res.status(200).json({ message: 'Grant request rejected successfully', updatedGrant });
  } catch (error) {
    console.error('Error rejecting grant request:', error);
    res.status(500).json({ error: 'Failed to reject the grant request' });
  }
});

router.post('/eir/accept', async (req, res) => {
  const { requestId } = req.body;

  try {
    const updatedRequest = await EIR.findByIdAndUpdate(
      requestId,
      {
        status: {
          status: 'Approved',
          decision_date: new Date(),
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'EIR request not found' });
    }
    console.log('EIR request called');
    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/eir/reject', async (req, res) => {
  const { requestId } = req.body; // Extract the requestId from the request body
  try {
    console.log('EIR request called');
    const updatedRequest = await EIR.findByIdAndUpdate(
      requestId,
      {
        'status.status': 'Rejected', // Update status to Rejected
        'status.decision_date': new Date(), // Set decision date to now
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'EIR request not found' });
    }

    res.json({ updatedRequest });
  } catch (error) {
    console.error('Error updating EIR request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/eir/in-progress', async (req, res) => {
  try {
    const { requestId } = req.body;
    console.log('EIR progress called');
    console.log('Request ID:', requestId);

    const updatedRequest = await EIR.findByIdAndUpdate(
      requestId,
      {
        'status.status': 'In Progress', // Update status to Rejected
        'status.decision_date': new Date(), // Set decision date to now
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      console.log('No document found for ID:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ updatedRequest });
  } catch (error) {
    console.error('Error updating EIR status:', error);
    res.status(500).json({ message: error.message });
  }
});


// Handle Accept Request
router.post('/grant/accept', async (req, res) => {
  const { grantId, status } = req.body;

  try {
    // Find the grant request by ID and update its status
    const updatedGrant = await GrantScheme.findByIdAndUpdate(
      grantId,
      {
        $set: {
          'grant_status.status': status,
          'grant_status.decision_date': new Date(), // Set the decision date
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedGrant) {
      return res.status(404).json({ error: 'Grant request not found' });
    }
    const mailOptions = {
      from: senderemail,
      to: updatedGrant.applicant.contact_details.email,
      subject: 'Acceptance OF Grant Request',
      html: `
       <h1> Congrats your grant request has been accepted</h1>
      `
  };
  // Send the verification email
  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Mail sent successfully to receiver");
      }
  });
    console.log('Accept request called');
    res.status(200).json({ message: 'Grant request accepted successfully', updatedGrant });
  } catch (error) {
    console.error('Error accepting grant request:', error);
    res.status(500).json({ error: 'Failed to accept the grant request' });
  }
});

router.get("/progress/:startup", async (req, res) => {
  try {
      const startupId = req.params.startup; // Get the startup ID from the request parameters
      const startup = await Startup.findById(startupId); // Wait for the startup data to be fetched

      // Check if the startup exists
      if (!startup) {
          return res.status(404).send({ message: 'Startup not found' });
      }

      console.log(req.params); // Log the parameters to the console
      console.log(startup.progress); // Log the progress to the console

      // Send the progress data in the response
      return res.status(200).send(startup.progress);
  } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      return res.status(500).send({ message: 'Server error' });
  }
});

router.get('/startups', async (req, res) => {
  try {
    // Fetch all startups and only the required fields
    const startups = await Startup.find();
    console.log(startups);
    res.status(200).send(startups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/messages/:id', async (req, res) => {
  try {
    // Fetch all startups and only the required fields
    const messages = await Messages.findOne({startup_id: req.params.id});
    // Format the data for the response
    // Send the formatted data
    res.status(200).send(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;