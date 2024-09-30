const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

io.on('connection', (socket) => {
  console.log(socket);
  console.log('a user connected');
});


http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

