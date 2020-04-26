const {ExpressPeerServer} = require('peer');

const initPeerServer = server => {
    return ExpressPeerServer(server, {
        allow_discovery: true,
        debug: true,
        path: '/myapp'
    });
};

module.exports = initPeerServer;
