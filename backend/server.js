const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const session = require('express-session');
const io = require('socket.io')(http);
const port = 4000;
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true});
const MongoStore = require('connect-mongo');
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true
  }));
app.use(express.json())
app.use(session({
    secret: 'abc', // Change to a strong secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.URL,
        collectionName: 'sessions', // Store sessions in the 'sessions' collection
        autoRemove: 'native' // Automatically remove expired sessions
    }),  
      cookie: { secure: false } // Set to true if using HTTPS
}));

app.get('/', (req, res) => {
//   req.session.abc= "123"
//   console.log(req.session);
  res.send('Hello World!')
});

app.use("/auth" , require("./routers/user/auth"))

io.on('connection', (socket) => {
  console.log(socket);
  console.log('a user connected');
});


http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

