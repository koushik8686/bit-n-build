const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const io = new Server(server);const port = 4000;
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
}));

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
    console.log('a user connected:', socket.id);
    // Listen for 'sendMessage' event from the client
    socket.on('sendMessage', async (messageData) => {
        try {
            // Store the message in the database
            await saveMessageToDB(messageData); // Define the function to save to DB
            
            // Broadcast the message to all connected clients
            io.emit('receiveMessage', messageData);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
