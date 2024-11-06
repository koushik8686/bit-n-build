const express = require('express');
const router = express.Router();
const Advertisement = require('../../models/adrequests');
const existingads= require('../../models/advertisements')
const startups = require('../../models/startupmodel')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const auth = new google.auth.GoogleAuth({
  keyFile: './sheetskey.json', // Replace with the path to your JSON key file
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets', // Full access to edit sheets
  ],});

const senderemail = "hexart637@gmail.com";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderemail,
        pass: 'zetk dsdm imvx keoa'
    }
});
async function getSheetId(spreadsheetId, sheetName) {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  const sheet = response.data.sheets.find(
    (s) => s.properties.title === sheetName
  );

  if (sheet) {
    return sheet.properties.sheetId;
  } else {
    throw new Error(`Sheet with name "${sheetName}" not found.`);
  }
}
async function deleteAdFromGoogleSheets(companyLink) {
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheetId = '1DqAAnv_zjCBraWIzj85lOY_72HxR02OQG-Eb46cPfZU';
    const sheetName = 'Form Responses 1';
    
    // Fetch the correct sheetId for 'Form Responses 1'
    const sheetId = await getSheetId(spreadsheetId, sheetName);
    
    const range = `${sheetName}!A:Z`;

    // Fetch existing data to locate the row to delete
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      const header = rows[0];
      const linkIndex = header.indexOf('Company Link');

      const rowIndex = rows.findIndex((row) => row[linkIndex] === companyLink);

      if (rowIndex === -1) {
        console.log('Ad not found in Google Sheets.');
        return;
      }

      const sheetRowIndex = rowIndex + 1;

      // Delete the row
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId, // Use the dynamic sheetId here
                  dimension: 'ROWS',
                  startIndex: sheetRowIndex - 1,
                  endIndex: sheetRowIndex,
                },
              },
            },
          ],
        },
      });

      console.log(`Advertisement with companyLink ${companyLink} deleted from Google Sheets.`);
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    console.error('Error deleting data from Google Sheets:', error);
  }
}

async function sendDeletionEmail(toEmail, adName) {
  try {
    await transporter.sendMail({
      from: '"Your Company" <your-email@gmail.com>', // Replace with your email
      to: toEmail,
      subject: 'Advertisement Request Deleted',
      text: `Dear ${adName},\n\nYour advertisement request has been regected.\n\nBest regards,\n StartX`,
    });
    console.log('Deletion email sent successfully.');
  } catch (error) {
    console.error('Error sending deletion email:', error);
  }
}
async function sendAcceptanceEmail(toEmail, adName) {
  try {
    await transporter.sendMail({
      from: '"Your Company" <your-email@gmail.com>', // Replace with your email
      to: toEmail,
      subject: 'Advertisement Request Accepted',
      text: `Dear ${adName},\n\nYour advertisement request has been Accepted And Your Ads Will Be Displayed On StartX.\n\nBest regards,\n StartX`,
    });
    console.log('Acceptance email sent successfully.');
  } catch (error) {
    console.error('Error sending deletion email:', error);
  }
}
// Function to fetch data from Google Sheets
async function fetchDataFromGoogleSheets() {
  try {
    const authClient = await auth.getClient();
    const spreadsheetId = '1DqAAnv_zjCBraWIzj85lOY_72HxR02OQG-Eb46cPfZU'; // Replace with your actual Google Sheet ID
    const range = 'Form Responses 1!A:Z'; // Adjust the range according to your sheet

    const response = await google.sheets('v4').spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      // Skip the header row and return the data as an array of objects
      const header = rows[0];
      return rows.slice(1).map(row => {
        const obj = {};
        header.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });
    } else {
      console.log('No data found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const adrequests = require('../../models/adrequests');

router.get('/newrequests', async function (req, res) {
  try {
    const newRequests = await fetchDataFromGoogleSheets(); // Fetch data from Google Sheets

    for (const request of newRequests) {
      console.log(request)
      // Check if the advertisement already exists in the database
      const existingAd = await Advertisement.findOne({
        email: request.Email,
        adverCompanyName: request['Ad name'],
      });
      if (!existingAd) {
        let localImageName = ''; // Store only the filename

        // Download the image from Google Drive
        if (request.Image) {
          const fileId = request.Image.match(/id=([a-zA-Z0-9_-]+)/)?.[1]; // Extract file ID from URL
          if (fileId) {
            try {
              const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
              // Request the image as a stream
              const response = await axios({
                url: downloadUrl,
                method: 'GET',
                responseType: 'stream',
              });
              
              // Generate unique filename with Date.now()
              const timestamp = Date.now();
              localImageName = `${request['Ad name']}-${timestamp}.jpg`;
              const imagePath = path.join(__dirname, '../../uploads/ads', localImageName);
              
              const writer = fs.createWriteStream(imagePath);
              // Pipe response stream to file writer
              response.data.pipe(writer);
              // Wait until the file is completely written
              await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
            } catch (err) {
              console.error(`Failed to download image for ${request['Ad name']}:`, err);
            }
          } else {
            console.error(`Invalid Google Drive link for ${request['Ad name']}`);
          }
        }
        // Create a new advertisement entry with the local image filename
        const newAd = new Advertisement({
          name: request['Your Name'],
          email: request.Email,
          phone: request['Phone '],
          description: request['Ad Description'],
          adverCompanyName: request['Ad name'],
          AdImgUrl: localImageName || request.Image, // Use filename or fallback to original URL if download fails
          companyLink: request['Company Link'],
          price: Number(request['Amount Willing To Pay']),
        });
        await newAd.save();
        console.log(`New advertisement added: ${request['Ad name']}`);
      } else {
        console.log(`Advertisement already exists for: ${request['Ad name']}`);
      }
    }

    // Fetch all advertisements to send back as the response
    const allAds = await Advertisement.find();
    res.status(200).send(allAds);
  } catch (error) {
    console.error('Error processing requests:', error);
    res.status(500).send('An error occurred while processing the requests.');
  }
});

let currentIndex = -1;
let currentWeight = 0;
let maxWeight = 0;
let gcdWeight = 1;

router.get('/requests',async function(req, res){
  const ads = await Advertisement.find();
  res.json(ads);
})
router.get('/getads',async function(req, res){
  const ads = await existingads.find();
  res.json(ads);
})

router.get('/:id',async function(req, res){
  const { id } = req.params;
  try {
    const ad = await existingads.findById(id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

router.get('/get/ad', async (req, res) => {
  try {
    const ads = await existingads.find();
    if (ads.length > 0) {
      // Calculate maxWeight and gcdWeight if not already set
      if (maxWeight === 0 || gcdWeight === 1) {
        maxWeight = Math.max(...ads.map(ad => ad.weight));
        gcdWeight = ads.reduce((acc, ad) => gcd(acc, ad.weight), ads[0].weight);
      }

      // Start Weighted Round Robin Logic
      while (true) {
        currentIndex = (currentIndex + 1) % ads.length;

        // Reset currentWeight if we have looped through all ads
        if (currentIndex === 0) {
          currentWeight -= gcdWeight;
          if (currentWeight <= 0) {
            currentWeight = maxWeight;
          }
        }

        // Check if the ad at currentIndex should be selected based on currentWeight
        if (ads[currentIndex].weight >= currentWeight) {
          // Get the selected ad
          const selectedAd = ads[currentIndex];
          // Increment impressions for the selected ad in the database
          await existingads.findByIdAndUpdate(selectedAd._id, {
            $inc: { impreessions: 1 }
          });
          // Return the selected ad
          return res.status(200).json(selectedAd);
        }
      }
    } else {
      return res.status(404).json({ message: 'No advertisements found' });
    }
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Route to update click count based on adverCompanyId
router.post('/click/:adverCompanyId', async (req, res) => {
  const { adverCompanyId } = req.params;
  const startup = req.body.startup;
  try {
    const ad = await existingads.findById( adverCompanyId );
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    ad.noOfClicks += 1;
    const sta = await startups.findById(startup);
    if (sta) {
      ad.clicks.push({
        clickedby: sta.kyc.company_name,
        timestamp: new Date()
      });
    }
    await ad.save();
    res.status(200).json({ message: 'Click count updated', clicks: ad.noOfClicks });
  } catch (error) {
    console.error('Error updating click count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get all metrics (all advertisements data)
router.get('/getmetrics', async (req, res) => {
  try {
    const ads = await Advertisement.find(); // Fetch all advertisements

    if (ads.length > 0) {
      res.status(200).json(ads); // Send all advertisement data to the frontend
    } else {
      res.status(404).json({ message: 'No advertisements found' });
    }
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add/:id', async (req, res) => {
  const { id } = req.params;
   currentIndex = -1;
 currentWeight = 0;
 maxWeight = 0;
gcdWeight = 1;
  try {
    // Find the ad request by ID
    const adRequest = await Advertisement.findById(id);
    if (!adRequest) {
      return res.status(404).json({ message: 'Ad request not found' });
    }
    // Create a new advertisement using the ad request data
    const newAd = new existingads({
      name:adRequest.name,
      email: adRequest.email,
      phone: adRequest.phone,
      adverCompanyName: adRequest.adverCompanyName,
      AdImgUrl: adRequest.AdImgUrl,
      companyLink: adRequest.companyLink,
      description: adRequest.description,
      noOfClicks: 0, 
      weight: req.body.weight || 1, 
      clicks:[]
    });
    // Save the new advertisement to the database
    await newAd.save();
    const { companyLink, email, adverCompanyName } = adRequest;
    await deleteAdFromGoogleSheets(companyLink)
    await sendAcceptanceEmail(email, adverCompanyName)
    // Delete the ad request from AdRequest collection
    await Advertisement.findByIdAndDelete(id);
    res.status(201).json({ message: 'Advertisement added successfully and ad request removed', ad: newAd });
  } catch (error) {
    console.error('Error moving ad request to advertisements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to delete an advertisement based on adverCompanyId
router.delete('/delete/request/:adverCompanyId', async (req, res) => {
  const { adverCompanyId } = req.params;
  console.log(adverCompanyId);

  try {
    // Find the advertisement to get the companyLink and email
    const adToDelete = await Advertisement.findById(adverCompanyId);
    if (!adToDelete) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    const { companyLink, email, adverCompanyName } = adToDelete;

    // Delete from Google Sheets
    await deleteAdFromGoogleSheets(companyLink);
    // Send notification email
    await sendDeletionEmail(email, adverCompanyName);
    // Delete from MongoDB
    await Advertisement.findByIdAndDelete(adverCompanyId);
    res.status(200).send({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete/:id' , function (req, res) {
  existingads.findByIdAndDelete(req.params.id).then( function(err) {
    if (err){
    console.log(err);
    return res.status(200).send(err);  
  }
  console.log("deleted ad sucessfully");
    res.status(200).send('Advertisement deleted successfully');
  });
})

module.exports = router;
