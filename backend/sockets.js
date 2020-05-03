const IOServer = require('socket.io');
const roomManager = require('./rooms');

const util = {
    getSocketCustomData: (io, socketId) => {
        const socket = io.nsps['/'].sockets[socketId]; // https://stackoverflow.com/a/47096361
        return socket ? socket.customData : false;
    },
    addCustomSocketData: (io, socketId, addedCustomData) => {
        let customDataRef =  io.nsps['/'].connected[socketId].customData;
        return io.nsps['/'].connected[socketId].customData = {...customDataRef, ...addedCustomData};
    },
    getSocketIdsInRoom: (io, roomId) => {
        const room = io.sockets.adapter.rooms[roomId];
        return room ? Object.keys(room.sockets) : false;
    }
};

// Actions that the client can emit himself to trigger some actions (instead of having a REST API)
const initSocketActions = (socket) => {
    // create room
    socket.on('create', (roomData, callback) => {
        const roomRef = roomManager.createRoom(roomData);
        const response = roomRef && roomRef.id ? roomRef.id : false;
        callback(response);
    });

    // Join room.
    socket.on('join', ({roomId, password, peerId}, callback) => {
        if (!roomManager.doesRoomExist(roomId)) {
            console.log(`Room with the id: ${roomId} does not exist`);
            callback(false);
            return;
        }

        const roomRef = roomManager.joinRoom(roomId, peerId, password);
        if (roomRef) {
            util.addCustomSocketData(io, socket.id, {currentRoomId: roomRef.id});
            socket.join(roomRef.id);
            socket.to(roomRef.id).emit('user-join', roomRef);
        }

        roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
        console.log(`Room: ${roomRef.id} - joinedUsers: ${roomRef.joinedUsers}`);
        callback({room: roomRef});
    });

    // Leave room
    socket.on('leave', (roomId) => {
        console.log(`User: ${socket.id} left room: ${roomId}`);
        socket.to(roomId).emit('user-leave', socket.id);
    });
};

const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    io.on('connection', function (socket) {
        // Send to connected client because on the clientside socket.id is sometimes undefined after connecting
        io.to(socket.id).emit('ready', socket.id);

        // Arbitrary data can be send from the frontend via query params.
        const nickname = socket.handshake.query['nickname'];
        socket.customData = {nickname: nickname, peerId: socket.id};
        console.log('User with nickname:', nickname, 'connected. PeerId:', socket.customData.peerId);

        // Init user triggered actions
        initSocketActions(socket);

        // Cleanup when client disconnects
        socket.on('disconnect', (what) => {
            console.log(`User: ${socket.id} disconnected`);
            const customData = util.getSocketCustomData(io, socket.id);
            if (customData && customData.currentRoomId) {
                socket.to(customData.currentRoomId).emit('user-leave', socket.id);
                util.addCustomSocketData(io, socket.id, {currentRoomId: null});
                console.log(`User ${socket.nickname} with peerId: ${socket.peerId} disconnected from roomId ${socket.currentRoomId} `);
            }
        })
    });
    return io;
};

module.exports = initSocketIO;
