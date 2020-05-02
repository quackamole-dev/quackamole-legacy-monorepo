const IOServer = require('socket.io');
const roomManager = require('./rooms');

const util = {
    getSocketCustomData: (io, socketId) => {
        const socket = io.nsps['/'].sockets[socketId];
        // const socket = io.nsps['/'].connected[socketId]; // https://stackoverflow.com/a/47096361
        if (socket) {
            return socket.customData;
        } else {
            return false;
        }
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

const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    io.on('connection', function (socket) {
        const nickname = socket.handshake.query['nickname'];
        socket.customData = {nickname: nickname, peerId: socket.id};
        console.log('User with nickname:', nickname, 'connected. PeerId:', socket.customData.peerId);

        // creates a room without joining it.
        socket.on('create', roomData => {
            roomManager.createRoom(roomData);
        });

        socket.broadcast.to(socket.id).emit('ready', socket.id);


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

                roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
                console.log('wtf joined user ids', roomRef.joinedUsers);
                callback({room: roomRef});
            } else {
                console.log('room does not exist');
            }
            callback(false);
        });

        socket.on('leave', (roomId) => {
            console.log('user left', roomId);
            socket.to(roomId).emit('user-leave', {roomId, peerId: socket.id});

        });

        socket.on('disconnect', (what) => {
            console.log('disconnect', what, socket.id);
            const customData = util.getSocketCustomData(io, socket.id);
            if (customData && customData.currentRoomId) {
                socket.to(customData.currentRoomId).emit('user-leave', socket.id);
                // roomManager
                util.addCustomSocketData(io, socket.id, {currentRoomId: null});
                console.log(`User ${socket.nickname} with peerId: ${socket.peerId} disconnected from roomId ${socket.currentRoomId} `);
            }
        })
    });
    return io;
};

module.exports = initSocketIO;
