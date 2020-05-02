const IOServer = require('socket.io');
const roomManager = require('./rooms');

const util = {
    // Kind of hacky way to get data of other sockets: https://stackoverflow.com/a/47096361
    getSocketCustomData: (io, socketId) => {
        return io.nsps['/'].connected[socketId].customData;
    },
    addCustomSocketData: (io, socketId, addedCustomData) => {
        let customDataRef =  io.nsps['/'].connected[socketId].customData;
        return io.nsps['/'].connected[socketId].customData = {...customDataRef, ...addedCustomData};
    },
};

const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    io.on('connection', function (socket) {
        console.log('connection');
        const nickname = socket.handshake.query['nickname'];
        socket.customData = {nickname: nickname, peerId: socket.id};

        io.emit('peer-connect', `${socket.customData.nickname} has joined, his peerId is ${socket.customData.peerId}`);

        // creates a room without joining it.
        socket.on('create', roomData => {
            console.log('on create');
            roomManager.createRoom(roomData);
        });

        // Join a room.
        socket.on('join', ({roomId, password, peerId}, callback) => {
            if (roomManager.doesRoomExist(roomId)) {
                const roomRef = roomManager.joinRoom(roomId, peerId, password);
                if (roomRef) {
                    util.addCustomSocketData(io, socket.id, {currentRoomId: roomRef.id});
                    socket.join(roomRef.id);
                    socket.to(roomRef.id).emit('user-join', roomRef);

                    // One way to iterate over clients in the same room
                    // io.in(roomRef.id).clients((err, clients) => {
                    //     clients.forEach(socketId => {
                    //         console.log('clients in room', socketId);
                    //     })
                    // });
                }
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
            if (socket.currentRoomId) {
                socket.to(socket.currentRoomId).emit('user-disconnect', socket.peerId);
                socket.currentRoomId = null;
                console.log(`User ${socket.nickname} with peerId: ${socket.peerId} disconnected from roomId ${socket.currentRoomId} `);
            }
        })
    });
    return io;
};

module.exports = initSocketIO;
