// require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const initPeerServer = require('./peer.js');
const initSocketIO = require('./sockets');

// JIMMY: you will need to generate SSL certificates (for https) to run the backend locally. Also comment/uncomment the key & cert below.
// See the readme file for instructions on how to do that.
// If you want to skip that change the import: const https = require('https'); to const http = require('http'); (and all https need to be changed to http)
// and remove the sslOptions argument from all https.createServer methods
let sslOptions = {
    // socket communication from the frontend doesn't work correctly on localhost atm. Need to self-sign certificates. Might use https://github.com/jsha/minica
    // key: fs.readFileSync('localhost.key'),
    // cert: fs.readFileSync('localhost.crt'),
    key: fs.readFileSync('/etc/letsencrypt/live/derpmasters.online/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/derpmasters.online/fullchain.pem'),
};

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'null', 'none', 'http://localhost:63342', '', 'https://localhost:3000, https://localhost'];
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

///////////////////
// PeerJS Server //
///////////////////
const app1 = express();
const server1 = https.createServer(sslOptions, app1);

app1.get('/test', function (req, res) {
    res.json({msg: 'peerjs server test route'})
});

app1.use('/peer', initPeerServer(server1));
app1.use(morgan("combined"));
app1.use(helmet());
app1.use(cors());
server1.listen(5001, () => console.log('PeerJS server listening on port: ', 5001));

//////////////////////
// Socket IO Server //
//////////////////////
const app2 = express();
const server2 = https.createServer(sslOptions, app2);

// JIMMY: This line contains everything related to socket.io, connection handling, init listeners etc
//
const io = initSocketIO(server2);

app2.use(morgan("combined"));
app2.use(helmet());
app2.use(cors());
app2.use(bodyParser.urlencoded({extended: false}));
app2.use(bodyParser.json());

// JIMMY: This is the rest api you can use to create rooms.
// If you look at the "app2.use('/api', router)" you will notice that it looks kinda similar to urlpatterns in urls.py files of django
const router = require('./router');
app2.use('/api', router);

server2.listen(5002, () => console.log('SocketIO server listening on port: ',  5002));

// JIMMY TASK:
// search for all comments prefixed with "JIMMY" it should give you some hints
// Even though it could be done via socket.io, I added a rest api to create rooms. This means you can completely ignore socket.io for this task
// 1. Make a GET request (search for the endpoint ;) ) to get a list of all rooms inside the CreateRoomForm components useEffect(). Just console log the response (visit the endpoint in the browser first to see if backend is working)
// 2. Refactor the previous get request with a POST to the same endpoint. Figure out what you need to send in the body from the frontend to create a room (use postman to experiment, in postman goto setting->general->disable ssl cert verification)
// 3. The response of the previous POST request will be the roomId. Use it to generate the link to the room and display it in the frontend
// Feel free to ask questions if you are stuck on something =)
