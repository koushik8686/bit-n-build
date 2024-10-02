const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const port = 4000;
const cors = require('cors');
const dotenv = require('dotenv');
const messageModel = require('./models/adminmessages')

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routers/user/auth"));
app.use("/admin", require("./routers/admin/auth"));
app.use("/user", require("./routers/user/home"));
app.use("/submit", require("./routers/user/forms"));

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins a room based on their startupid from cookies
    socket.on('joinRoom', (startupid) => {
        socket.join(startupid); // Join the room with startupid
        console.log(`User ${socket.id} joined room ${startupid}`);
    });

    // Listen for messages from users in the room
    socket.on('sendMessage', async ({ roomId, messageData }) => {
        console.log("Message received from user in room:", roomId, messageData);
        try {
            io.to(roomId).emit('receiveMessage', messageData);
            console.log(`Message sent to room ${roomId}:`, messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
        
                try {
            // Find or create the message document for the specific startup
            const existingMessages = await messageModel.findOne({ startup_id: roomId });
            if (existingMessages) {
               console.log(existingMessages.startup_id, );
                // If messages already exist, push the new message to the messages array
                existingMessages.messsages[existingMessages.messsages.length]={
                    message: messageData.message,
                    sender: messageData.sender,
                    created_at: new Date(),
                };
                await existingMessages.save(); // Save the updated document
            } else {
                // If no messages exist, create a new document
                const newMessage = new messageModel({
                    startup_id: roomId,
                    messages: [{
                        message: messageData.message,
                        sender: messageData.sender,
                        created_at: new Date(),
                    }],
                });
                await newMessage.save(); // Save the new document
            }
            console.log("Message saved to database.");
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    });
    socket.on('BroadcastMessage', async ({ roomId, messageData }) => {
        console.log("Message received from user in room:", roomId, messageData);
        try {
            io.emit('receiveMessage', messageData);
            console.log(`Message sent to room ${roomId}:`, messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
                try {
            // Find or create the message document for the specific startup
            const existingMessages = await messageModel.findOne({ startup_id: roomId });
            if (existingMessages) {
               console.log(existingMessages.startup_id );
                // If messages already exist, push the new message to the messages array
                existingMessages.messsages[existingMessages.messsages.length]={
                    message: messageData.message,
                    sender: messageData.sender,
                    created_at: new Date(),
                };
                await existingMessages.save(); // Save the updated document
            } else {
                // If no messages exist, create a new document
                const newMessage = new messageModel({
                    startup_id: roomId,
                    messages: [{
                        message: messageData.message,
                        sender: messageData.sender,
                        created_at: new Date(),
                    }],
                });
                await newMessage.save(); // Save the new document
            }
            console.log("Message saved to database.");
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
