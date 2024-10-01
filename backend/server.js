const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 4000;
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true
  }));
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use("/auth" , require("./routers/user/auth"))
app.use("/admin" , require("./routers/admin/auth"))
app.use('/user' , require("./routers/user/home"))


io.on('connection', (socket) => {
  console.log(socket);
  console.log('a user connected');
});


http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

