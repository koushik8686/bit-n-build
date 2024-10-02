const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const port = 4000;
const cors = require('cors');
const dotenv = require('dotenv');

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

    // User joins a room based on their userId from cookies
    socket.on('joinRoom', (userId) => {
        socket.join(userId); // Join the room with userId
        console.log(`User ${socket.id} joined room ${userId}`);
    });

    // Listen for messages from users in the room
    socket.on('sendMessage', ({ roomId, messageData }) => {
        console.log("Message received from user in room:", roomId, messageData);     
        // Broadcast the message to the admin or to all users in the room
        io.to(roomId).emit('receiveMessage', messageData);
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
