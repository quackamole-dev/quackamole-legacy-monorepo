const IOServer = require('socket.io');
const roomManager = require('./rooms');


// const serverSocketIO = http.createServer(app1);
// const io = require('socket.io').listen(serverSocketIO);
// const io = require('socket.io')(server);


const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    // io.origins((origin, callback) => {
    //     if (origin !== 'https://foo.example.com') {
    //         return callback('origin not allowed', false);
    //     }
    //     callback(null, true);
    // });

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
            // const roomRef = roomManager.rooms[room.id];
            if (roomManager.doesRoomExist(room.id)) {
                roomManager.userJoinRoom(room.id, {peerId, socket}, room.password);
                callback({room: roomRef});
            } else {
                console.log('room does not exist');
            }

            callback('hello callback');
        });

        socket.on('leave', (roomId, callback) => {
            console.log('leaving room');
            socket.leave(roomId);
            io.emit('peer-left', 'peer has left');
            callback(' you left room: ' + roomId);
        });

        socket.on('disconnect', () => {
            // console.log('disconnected', socket);
        })
    });
    return io;
};

module.exports = initSocketIO;
