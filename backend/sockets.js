const IOServer = require('socket.io');
const roomManager = require('./rooms');


const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    io.on('connection', function (socket) {
        console.log('connection');
        const nickname = socket.handshake.query['nickname'];
        const peerId = socket.handshake.query['peerId'];
        io.emit('peer-connect', `${nickname} has joined, his peerId is ${peerId}`);

        // creates a room without joining it.
        socket.on('create', roomData => {
            console.log('on create');
            roomManager.createRoom(roomData);
        });

        // Join a room.
        socket.on('join', ({room, peerId}, callback) => {
            if (roomManager.doesRoomExist(room.id)) {
                const roomRef = roomManager.userJoinRoom(room.id, {peerId, socket}, room.password);
                callback({room: roomRef});
            } else {
                console.log('room does not exist');
            }

            callback(false);
        });

        socket.on('leave', (roomId, callback) => {
            console.log('leaving room');
            socket.leave(roomId);
            io.emit('peer-left', 'peer has left');
            callback(' you left room: ' + roomId);
        });

        socket.on('disconnect', () => {
            console.log('disconnected', socket);
        })
    });
    return io;
};

module.exports = initSocketIO;
