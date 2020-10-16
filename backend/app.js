#!/usr/bin/env node

require('dotenv').config({ path: './config.env' });
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const initSocketIO = require('./sockets');

const HTTPS_ENABLED = process.env.HTTPS_ENABLED === 'true';
const environment = process.env.NODE_ENV || 'development';

let sslOptions = null;
if (HTTPS_ENABLED) {
  // FIXME specify certs in .env
  const sslKey = environment === 'production' ? '/etc/letsencrypt/live/derpmasters.online/privkey.pem' : 'localhost.key';
  const sslCert = environment === 'production' ? '/etc/letsencrypt/live/derpmasters.online/fullchain.pem' : 'localhost.crt';
  sslOptions = { key: fs.readFileSync(sslKey), cert: fs.readFileSync(sslCert) };
}

// const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'null', 'none', 'http://localhost:63342', '', 'https://localhost:3000, https://localhost'];
// const corsOptions = {
//     credentials: true,
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
// };

/////////////////
// Init Server //
/////////////////
const app = express();
const server = HTTPS_ENABLED ? https.createServer(sslOptions, app) : http.createServer(app);

const io = initSocketIO(server);

app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = require('./router');
app.use('/api', router);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('server listening on port: ', port, 'https:', HTTPS_ENABLED));
