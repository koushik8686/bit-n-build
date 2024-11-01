const express = require('express');
const User = require('../../models/usermodel');
const Startup = require("../../models/startupmodel")
const router = express.Router();
var nodemailer = require('nodemailer');
const senderemail = "hexart637@gmail.com";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderemail,
        pass: 'zetk dsdm imvx keoa'
    }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profiles/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file names
  }
});

const upload = multer({ storage });

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);
  try {
    // Check if the email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user without password encryption
    const newUser = new User({
      username,
      password, // store the plain text password directly
      email
    });
    await newUser.save();
    const mailOptions = {
        from: senderemail,
        to: email,
        subject: 'startX',
        html: `
         <h1>Thanks for Registering your startup in our website</h1>
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
    // Save the user to the database
    const savedUser = await newUser.save();

    // Store user ID in session
    res.status(200).json({ message: 'Registration successful!', userId: savedUser._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/kyc', upload.single('profile_pic') ,  async (req, res) => {
  const {
    company_name, address, contact_person_name, contact_person_email,
    contact_person_phone, incorporation_date, industry, website, user
  } = req.body;
  const profilePicPath = req.file ? req.file.filename : "default.png"; // Path to the uploaded profile picture

  try {
    // Create the startup (KYC) details
    const newKYC = new Startup({
      kyc: {
        company_name,
        address,
        contact_person: {
          name: contact_person_name,
          email: contact_person_email,
          phone: contact_person_phone
        },
        company_details: {
          incorporation_date,
          industry,
          website
        },
        profile_picture:profilePicPath
      },
      progress: [],
      reports: [],
      messages: [],
      grants: [],
      
    });

    // Save the KYC details to the database
    const savedKYC = await newKYC.save();

    // Link the KYC to the logged-in user
    await User.findByIdAndUpdate(user, { startup: savedKYC._id });
    res.status(200).json({ message: 'KYC details submitted successfully', startup: savedKYC._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit KYC details' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
   console.log(user.email , user.password , password);
    // Directly compare passwords without encryption
    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user._id, startup: user.startup });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
