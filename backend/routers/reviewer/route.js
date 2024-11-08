const express = require('express');
const Reviewer = require('../../models/reviewers');
const router = express.Router();
const nodemailer= require('nodemailer')
const senderemail = "hexart637@gmail.com";
const EIR = require('../../models/EirSchema')
const GrantRequests = require('../../models/GrandSchemeSchema')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderemail,
        pass: 'zetk dsdm imvx keoa'
    }
});

router.post('/register', async (req, res) => {
    const { name, password, email , organization , about } = req.body;
    console.log(req.body);
    try {
      // Check if the email already exists
      const exists = await Reviewer.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      // Create a new reviewer without password encryption
      const newReviewer = new Reviewer({
        name,
        password, // store the plain text password directly
        email,
        organization,
        about
      });
      await newReviewer.save();
      const mailOptions = {
          from: senderemail,
          to: email,
          subject: 'startX',
          html: `
           <h1>You are registered as a reviewer on startx</h1>
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
      // Save the reviewer to the database
      const savedUser = await newReviewer.save();
      // Store reviewer ID in session
      res.status(200).json({ message: 'Registration successful!', reviewerId: savedUser._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to register reviewer' , erroris:error });
    }
  });
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Find reviewer by email
      const reviewer = await Reviewer.findOne({ email });
      if (!reviewer) return res.status(400).json({ error: 'Reviewer not found' });
     console.log(reviewer.email , reviewer.password , password);
      // Directly compare passwords without encryption
      if (password !== reviewer.password) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      res.status(200).json({ message: 'Login successful', reviewerId: reviewer._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

// Add a reviewer
router.post('/add-reviewer', async (req, res) => {
    try {
        const newReviewer = new Reviewer(req.body);
        await newReviewer.save();
        res.status(201).json(newReviewer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all reviewers
router.get('/reviewers', async (req, res) => {
    try {
        const reviewers = await Reviewer.find();
        res.status(200).json(reviewers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all reviews for a specific reviewer
router.get('/:reviewerId/reviews', async (req, res) => {
  try {
    const reviewer = await Reviewer.findById(req.params.reviewerId);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
    // Populate review details from EIR documents
    const reviews = await EIR.find({
      'reviews.reviewer_id': req.params.reviewerId
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching reviews', error: error.message });
  }
});
router.get('/:reviewerId/grantreviews', async (req, res) => {
  try {
    const reviewer = await Reviewer.findById(req.params.reviewerId);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
    // Populate review details from EIR documents
    const reviews = await GrantRequests.find({
      'reviews.reviewer_id': req.params.reviewerId
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching reviews', error: error.message });
  }
});

router.post('/eir/:eir/:reviewer' , async (req, res) => {
  try {
    EIR.findById(req.params.eir).then((eir) => {
      if (!eir) {
        return res.status(404).json({ message: 'EIR not found' });
      }
      // Add new review to the EIR document
      eir.reviews.forEach((review) => {
        if (review.reviewer_id === req.params.reviewer) {
          review.rating = req.body.rating;
          review.comments.push(req.body.comment);
          review.status="completed"
        }
      })
      eir.save().then((savedEir) => {
        res.status(200).json(savedEir);
      })
      
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while'})
  }
})
router.post('/grants/:grant/:reviewer' , async (req, res) => {
  try {
    GrantRequests.findById(req.params.grant).then((grant) => {
      if (!grant) {
        return res.status(404).json({ message: 'EIR not found' });
      }
      // Add new review to the EIR document
      grant.reviews.forEach((review) => {
        if (review.reviewer_id === req.params.reviewer) {
          review.rating = req.body.rating;
          review.comments.push(req.body.comment);
          review.status="completed"
        }
      })
      grant.save().then((savedEir) => {
        res.status(200).json(savedEir);
      })
      
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while'})
  }
})

module.exports = router;
