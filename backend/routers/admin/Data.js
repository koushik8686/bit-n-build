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

module.exports = router;
