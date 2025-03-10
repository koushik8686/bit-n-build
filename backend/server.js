const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const port = 4000;
const cors = require('cors');
const dotenv = require('dotenv');
const messageModel = require('./models/adminmessages');
const startupModel = require("./models/startupmodel");
const Messages = require('./models/adminmessages');
const path = require('path');

dotenv.config();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.URL || "mongodb://127.0.0.1:27017/hakathin");

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.',
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server.',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    });
});

// Router-Level Middleware
const routeLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};


// Routes with Middleware
app.use("/auth", require("./routers/user/auth"));
app.use("/admin", require("./routers/admin/auth"));
app.use("/user", routeLogger, require("./routers/user/home"));
app.use("/submit", routeLogger, require("./routers/user/forms"));
app.use("/get", routeLogger, require("./routers/admin/Data"));
app.use('/ads/', require('./routers/advertisement/advertisement'));
app.use('/review/', require('./routers/reviewer/route'));

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Socket.IO connection (unchanged)
io.on('connection', (socket) => {
    // User joins a room based on their startupid from cookies
    socket.on('joinRoom', (startupid) => {
        socket.join(startupid);
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
                // If messages already exist, push the new message to the messages array
                existingMessages.messsages[existingMessages.messsages.length] = {
                    message: messageData.message,
                    sender: messageData.sender,
                    created_at: new Date(),
                };
                await existingMessages.save();
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
                await newMessage.save();
            }
            console.log("Message saved to database.");
        } catch (error) {
            console.error("Error saving message to database:", error);
        }
    });
    
    socket.on('BroadcastMessage', async ({ messageData }) => {
        console.log("Broadcasting message:", messageData);
        try {
            io.emit('receiveMessage', messageData);
            console.log("Broadcast message sent to all clients:", messageData);
        } catch (error) {
            console.error('Error broadcasting message:', error);
        }
    
        try {
            const allStartups = await startupModel.find();
            if (allStartups && allStartups.length > 0) {
                for (let startup of allStartups) {
                    const roomId = startup._id;
                    const existingMessages = await messageModel.findOne({ startup_id: roomId });
                    if (existingMessages) {
                        existingMessages.messsages.push({
                            message: messageData.message,
                            sender: messageData.sender,
                            created_at: new Date(),
                        });
                        await existingMessages.save();
                    } else {
                        const newMessage = new messageModel({
                            startup_id: roomId,
                            messages: [{
                                message: messageData.message,
                                sender: messageData.sender,
                                created_at: new Date(),
                            }],
                        });
                        await newMessage.save();
                    }
                    console.log(`Message saved to database for startup ${roomId}.`);
                }
            } else {
                console.log("No startups found.");
            }
        } catch (error) {
            console.error("Error saving broadcast message to database:", error);
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
