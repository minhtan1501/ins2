require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const connect = require('./config/db');
const { handleError } = require('./utils/helper');
const router = require('./routers');
const SocketServer = require('./socketServer');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'))

// socket

connect()

router(app)


app.use(handleError)

const http = require('http').createServer(app);
const io = require('socket.io')(http);


io.on('connection',socket =>{
    SocketServer(socket);
})


http.listen(5000, () =>{
    console.log('Server is running on port',5000);
})