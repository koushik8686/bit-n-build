const mongoose = require('mongoose');
const Advertisement = require('./models/advertisements'); // Adjust the path as needed
mongoose.connect(process.env.URL||"mongodb://127.0.0.1:27017/hakathin", { useNewUrlParser: true, useUnifiedTopology: true });
const addDummyClicks = async (adId) => {
  const dummyClicks = [
    { timestamp: new Date("2024-11-01T10:00:00.000Z"), clickedby: "Alice Johnson" },
    { timestamp: new Date("2024-11-01T11:15:00.000Z"), clickedby: "Bob Smith" },
    { timestamp: new Date("2024-11-01T12:30:00.000Z"), clickedby: "Charlie Brown" },
    { timestamp: new Date("2024-11-01T14:00:00.000Z"), clickedby: "Diana Prince" },
    { timestamp: new Date("2024-11-02T09:00:00.000Z"), clickedby: "Edward Elric" },
    { timestamp: new Date("2024-11-02T10:45:00.000Z"), clickedby: "Fiona Gallagher" },
    { timestamp: new Date("2024-11-02T11:30:00.000Z"), clickedby: "George Costanza" },
    { timestamp: new Date("2024-11-02T13:15:00.000Z"), clickedby: "Hannah Baker" },
    { timestamp: new Date("2024-11-03T08:30:00.000Z"), clickedby: "Ivy League" },
    { timestamp: new Date("2024-11-03T09:00:00.000Z"), clickedby: "Jack Sparrow" },
    { timestamp: new Date("2024-11-03T10:00:00.000Z"), clickedby: "Kelly Clarkson" },
    { timestamp: new Date("2024-11-03T11:00:00.000Z"), clickedby: "Leo Messi" },
    { timestamp: new Date("2024-11-03T12:00:00.000Z"), clickedby: "Mona Lisa" },
    { timestamp: new Date("2024-11-03T13:00:00.000Z"), clickedby: "Nina Simone" },
    { timestamp: new Date("2024-11-03T14:00:00.000Z"), clickedby: "Oscar Wilde" },
    { timestamp: new Date("2024-11-03T15:00:00.000Z"), clickedby: "Peter Parker" },
    { timestamp: new Date("2024-11-03T16:00:00.000Z"), clickedby: "Quinn Fabray" },
    { timestamp: new Date("2024-11-03T17:00:00.000Z"), clickedby: "Ravi Patel" },
    { timestamp: new Date("2024-11-03T18:00:00.000Z"), clickedby: "Sophie Turner" },
    { timestamp: new Date("2024-11-03T19:00:00.000Z"), clickedby: "Tony Stark" },
    { timestamp: new Date("2024-11-03T20:00:00.000Z"), clickedby: "Uma Thurman" }
  ];

  try {
  
    const result = await Advertisement.updateOne(
      { _id: adId }, // Find advertisement by ID
      { $push: { clicks: { $each: dummyClicks } } } // Push each dummy click to the clicks array
    );
    
    if (result.nModified > 0) {
      console.log('Dummy clicks added successfully');
    } else {
      console.log('No document was updated');
    }
  } catch (error) {
    console.error('Error adding dummy clicks:', error);
  }
};

// Replace '6727222c94c688a2d74d11f7' with your actual advertisement ID
addDummyClicks('6727222c94c688a2d74d11f7');
