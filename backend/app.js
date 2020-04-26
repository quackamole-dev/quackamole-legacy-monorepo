const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const initPeerServer = require('./peer.js');
const initSocketIO = require('./sockets');

const app = express();
const server = http.createServer(app);

app.get('/test', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

const whitelist = ['http://localhost:3000', 'null', 'none', 'http://localhost:63342', '', 'localhost:3000'];
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

app.use(morgan("common"));
app.use(helmet());
app.use(cors(corsOptions));
app.use('/peerjs', initPeerServer(server));
initSocketIO(server);

const port = process.env.PORT || 9000;
server.listen(port, () => console.log('server listening on port: ', port));
