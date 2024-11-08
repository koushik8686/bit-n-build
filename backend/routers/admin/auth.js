const express = require('express');
const router = express.Router();
const Startup = require('../../models/startupmodel');
const EIR = require('../../models/EirSchema'); // Update with your EIR model path
const GrantScheme = require('../../models/GrandSchemeSchema');
const Messages = require('../../models/adminmessages')
const Reviewer = require('../../models/reviewers');
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
router.get('/eir/:id', async (req, res) => {
  EIR.findById(req.params.id).then((eirRequests) => {
    if (!eirRequests) {
      return res.status(404).json({ message: 'EIR request not found' });
    }
    res.status(200).json(eirRequests);
  })
})
router.post('/eir/selectreviewer/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const selectedReviewerIds = req.body; // Array of currently selected reviewer IDs

    const eirDocument = await EIR.findById(requestId);
    if (!eirDocument) {
      return res.status(404).json({ message: 'EIR document not found' });
    }

    // Current reviewers in EIR document
    const currentReviewerIds = eirDocument.reviews.map(review => review.reviewer_id.toString());

    // Determine reviewers to add and remove
    const reviewersToAdd = selectedReviewerIds.filter(id => !currentReviewerIds.includes(id));
    const reviewersToRemove = currentReviewerIds.filter(id => !selectedReviewerIds.includes(id));

    // Add new reviewers
    await Promise.all(reviewersToAdd.map(async reviewerId => {
      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: `Reviewer with ID ${reviewerId} not found` });
      }

      // Add request ID to the reviewer's review list if not already present
      if (!reviewer.reviews.some(review => review.id === requestId)) {
        reviewer.reviews.push({ id: requestId });
        await reviewer.save();

        // Add reviewer details to the EIR document
        eirDocument.reviews.push({
          reviewer_id: reviewer._id,
          reviewer_name: reviewer.name,
          status:"pending",
          rating:0,
          reviewer_email: reviewer.email,
          reviewer_organization: reviewer.organization
        });
      }
    }));

    // Remove unselected reviewers
    await Promise.all(reviewersToRemove.map(async reviewerId => {
      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: `Reviewer with ID ${reviewerId} not found` });
      }

      // Remove the request ID from the reviewer's reviews
      reviewer.reviews = reviewer.reviews.filter(review => review.id !== requestId);
      await reviewer.save();

      // Remove from EIR document reviews as well
      eirDocument.reviews = eirDocument.reviews.filter(review => review.reviewer_id.toString() !== reviewerId);
    }));

    eirDocument.status.status = "Under Review"
    // Save the updated EIR document
    await eirDocument.save();

    res.status(200).json({ message: "Reviewers updated successfully", eir: eirDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating reviewers", error: error.message });
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
router.get('/grant/:id', async (req, res) => {
  GrantScheme.findById(req.params.id).then((GrantRequests) => {
    if (!GrantRequests) {
      return res.status(404).json({ message: 'Grant request not found' });
    }
    res.status(200).json(GrantRequests);
  })
})
router.post('/grant/selectreviewer/:requestId', async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const selectedReviewerIds = req.body; // Array of currently selected reviewer IDs
    const garnt = await GrantScheme.findById(requestId);
    if (!garnt) {
      return res.status(404).json({ message: 'GrantScheme document not found' });
    }

    // Current reviewers in GrantScheme document
    const currentReviewerIds = garnt.reviews.map(review => review.reviewer_id.toString());

    // Determine reviewers to add and remove
    const reviewersToAdd = selectedReviewerIds.filter(id => !currentReviewerIds.includes(id));
    const reviewersToRemove = currentReviewerIds.filter(id => !selectedReviewerIds.includes(id));

    // Add new reviewers
    await Promise.all(reviewersToAdd.map(async reviewerId => {
      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: `Reviewer with ID ${reviewerId} not found` });
      }
      // Add request ID to the reviewer's review list if not already present
      if (!reviewer.grantsreviews.some(review => review.id === requestId)) {
        reviewer.grantsreviews.push({ id: requestId });
        await reviewer.save();     // Add reviewer details to the GrantScheme document
        garnt.reviews.push({
          reviewer_id: reviewer._id,
          reviewer_name: reviewer.name,
          status:"pending",
          rating:0,
          reviewer_email: reviewer.email,
          reviewer_organization: reviewer.organization
        });
      }
      console.log(garnt);
    }));

    // Remove unselected reviewers
    await Promise.all(reviewersToRemove.map(async reviewerId => {
      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: `Reviewer with ID ${reviewerId} not found` });
      }
      // Remove the request ID from the reviewer's reviews
      reviewer.grantsreviews = reviewer.grantsreviews.filter(review => review.id !== requestId);
      await reviewer.save();
      // Remove from GrantScheme document reviews as well
      garnt.reviews = garnt.reviews.filter(review => review.reviewer_id.toString() !== reviewerId);
    }));

    garnt.grant_status.status = "Under Review"
    garnt.grant_status.decision_date = Date.now();
    // Save the updated GrantScheme document
    await garnt.save();

    res.status(200).json({ message: "Reviewers updated successfully", eir: garnt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating reviewers", error: error.message });
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


router.post('/eir/update-status', async (req, res) => {
  const { requestId, actionType } = req.body;
  console.log(req.body);
  
  let statusUpdate;
  let emailSubject;
  let emailBody;
  switch (actionType) {
    case 'approve':
      statusUpdate = { status: { status: 'Approved', decision_date: new Date() } };
      emailSubject = 'Acceptance of Grant Request';
      emailBody = '<h1>Congratulations! Your grant request has been approved.</h1>';
      break;
    case 'reject':
      statusUpdate = { status: { status: 'Rejected', decision_date: new Date() } };
      emailSubject = 'Rejection of Grant Request';
      emailBody = '<h1>Unfortunately, your grant request has been rejected.</h1>';
      break;

    case 'shortlist':
      statusUpdate = { status: { status: 'Short Listed', decision_date: new Date() } };
      emailSubject = 'Grant Request Short Listed';
      emailBody = '<h1>Good news! Your grant request has been short-listed.</h1>';
      break;

    case 'under-review':
      statusUpdate = { status: { status: 'Under Review', decision_date: new Date() } };
      emailSubject = 'Grant Request Under Review';
      emailBody = '<h1>Your grant request is under review. We will notify you of any updates.</h1>';
      break;

    default:

      return res.status(400).json({ message: 'Invalid action type' });
  }
  console.log(statusUpdate)
  try {
    const updatedRequest = await EIR.findByIdAndUpdate(requestId, statusUpdate, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: 'EIR request not found' });
    }
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: updatedRequest.entrepreneur.email,
      subject: emailSubject,
      html: emailBody
    };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log('Error sending email:', error);
    //   } else {
    //     console.log('Email sent successfully:', info.response);
    //   }
    // });

    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error('Error updating EIR status:', error);
    res.status(500).json({ message: 'Internal server error' });
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