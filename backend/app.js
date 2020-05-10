// require('dotenv').config();
const express = require('express');
const https = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const initPeerServer = require('./peer.js');
const initSocketIO = require('./sockets');

let sslOptions = {
    // socket communication from the frontend doesn't work correctly on localhost atm. Need to self-sign certificates. Might use https://github.com/jsha/minica
    // key: fs.readFileSync('localhost.key'),
    // cert: fs.readFileSync('localhost.crt'),
    // key: fs.readFileSync('/etc/letsencrypt/live/derpmasters.online/privkey.pem'),
    // cert: fs.readFileSync('/etc/letsencrypt/live/derpmasters.online/fullchain.pem'),
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
const server1 = https.createServer(app1);

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
const server2 = https.createServer(app2);

const io = initSocketIO(server2);

app2.use(morgan("combined"));
app2.use(helmet());
app2.use(cors());
app2.use(bodyParser.urlencoded({extended: false}));
app2.use(bodyParser.json());

const router = require('./router');
app2.use('/api', router);

server2.listen(5002, () => console.log('SocketIO server listening on port: ',  5002));
