const express = require('express');
const router = express.Router();
const Startup = require('../../models/startupmodel');

// Use async/await to handle the asynchronous operation
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
