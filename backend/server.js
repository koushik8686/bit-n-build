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
const startupModel = require("./models/startupmodel")
const Messages = require('./models/adminmessages')
dotenv.config();
const path = require('path')
// Connect to MongoDB
mongoose.connect(process.env.URL||"mongodb://127.0.0.1:27017/hakathin", { useNewUrlParser: true, useUnifiedTopology: true });


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routers/user/auth"));
app.use("/admin", require("./routers/admin/auth"));
app.use("/user", require("./routers/user/home"));
app.use("/submit", require("./routers/user/forms"));
app.use("/get" , require("./routers/admin/Data"))
app.use('/ads/' , require('./routers/advertisement/advertisement'))
app.use('/review/' , require('./routers/reviewer/route'))

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Socket.IO connection
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);
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
    socket.on('BroadcastMessage', async ({ messageData }) => {
        console.log("Broadcasting message:", messageData);
        try {
            // Emit the broadcast message to all connected clients
            io.emit('receiveMessage', messageData);
            console.log("Broadcast message sent to all clients:", messageData);
        } catch (error) {
            console.error('Error broadcasting message:', error);
        }
    
        try {
            // Fetch all startups from the database (assuming you have a Startup model)
            const allStartups = await startupModel.find();  // Adjust this to match your database query
            if (allStartups && allStartups.length > 0) {
                for (let startup of allStartups) {
                    const roomId = startup._id;  // Assuming _id is the unique identifier for the startup
                    // Find or create the message document for each startup
                    const existingMessages = await messageModel.findOne({ startup_id: roomId });
                    if (existingMessages) {
                        // If messages already exist, push the new message to the messages array
                        existingMessages.messsages.push({
                            message: messageData.message,
                            sender: messageData.sender,
                            created_at: new Date(),
                        });
                        await existingMessages.save();  // Save the updated document
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
                        await newMessage.save();  // Save the new document
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
