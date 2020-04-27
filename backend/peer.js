const { ExpressPeerServer } = require('peer');

const options = {
    allow_discovery: true,
    debug: true,
    path: '/signal'
};

const initPeerServer = server => {
    return ExpressPeerServer(server, options);
};

module.exports = initPeerServer;
