const IOServer = require('socket.io');
const roomManager = require('./rooms');
const {SocketCustomError} = require('./errors');

const util = {
    getSocketCustomData: (io, socketId) => {
        const socket = io.nsps['/'].sockets[socketId]; // https://stackoverflow.com/a/47096361
        return socket ? socket.customData : false;
    },
    addCustomSocketData: (io, socketId, addedCustomData) => {
        let socket =  io.nsps['/'].sockets[socketId];
        if (socket) {
            if (!socket.customData) {
                socket.customData = {};
            }
            return io.nsps['/'].connected[socketId].customData = {...socket.customData, ...addedCustomData};
        }
    },
    getSocketIdsInRoom: (io, roomId) => {
        const room = io.sockets.adapter.rooms[roomId];
        return room ? Object.keys(room.sockets) : false;
    },
    socketAlreadyInRoom: (socket, roomId) => {
        return Object.keys(socket.rooms).includes(roomId);
    },
    getSocketCurrentRooms: (io, socket) => {
        return socket.rooms;

    }
};

// Actions that the client can emit himself to trigger some actions (instead of having a REST API)
const initSocketActions = (io, socket) => {
    // create room
    socket.on('create', (roomData, callback) => {
        const roomRef = roomManager.createRoom(roomData);
        const response = roomRef && roomRef.id ? roomRef.id : false;
        callback(response);
    });

    // Join room.
    socket.on('join', ({roomId, password, peerId}, callback) => {
        // TODO rethink where to put this logic. It is only here so the roomManager doesn't have a direct dependency to socket.io
        if (!roomManager.doesRoomExist(roomId)) {
            console.log(`Room with the id: ${roomId} does not exist`);
            callback(new SocketCustomError('RoomError', 'This room does not exist.'));
            return;
        }

        if (util.socketAlreadyInRoom(socket, roomId)) {
            const socketData = util.getSocketCustomData(io, socket);
            console.log(`Socket with nickname: ${socketData.nickname} is already in room: ${roomId}`);
            callback(new SocketCustomError('RoomError', 'You are already in this room.'));
            return;
        }

        if(!roomManager.isCorrectPassword(roomId, password)) {
            console.log(`User: ${peerId} provided the wrong password for room: ${roomId}`);
            callback(new SocketCustomError('RoomError', 'You provided the wrong password.'));
            return;
        }

        const roomRef = roomManager.getRoomById(roomId);
        const numJoinedUsers = util.getSocketIdsInRoom(io, roomRef.id).length;
        if (numJoinedUsers >= roomRef.maxUsers) {
            callback(new SocketCustomError('RoomError', 'This room is already full.'));
            return;
        }

        util.addCustomSocketData(io, socket.id, {currentRoomId: roomRef.id});
        socket.join(roomRef.id);
        socket.to(roomRef.id).emit('user-join', roomRef);

        roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
        callback(null, {room: roomRef});
    });

    // Leave room
    socket.on('leave', (roomId) => {
        socket.to(roomId).emit('user-leave', socket.id);
        socket.leave(roomId);
        const {nickname, currentRoomId, peerId} = util.getSocketCustomData(io, socket.id);
        console.log(`User ${nickname} with peerId: ${peerId} left roomId ${currentRoomId}`);
        util.addCustomSocketData(io, socket.id, {currentRoomId: null});
    });
};

const initSocketIO = (server) => {
    const io = IOServer.listen(server);

    io.on('connection', function (socket) {
        // Send to connected client because on the clientside socket.id is sometimes undefined after connecting
        io.to(socket.id).emit('ready', socket.id);

        // Arbitrary data can be send from the frontend via query params.
        const nickname = socket.handshake.query['nickname'];
        socket.customData = {nickname: nickname, peerId: socket.id}; // FIXME use custom peerId, socket.id leads to error when it starts with underscore
        console.log('User with nickname:', nickname, 'connected. PeerId:', socket.customData.peerId);

        // Init user triggered actions
        initSocketActions(io, socket);

        // Cleanup when client disconnects
        socket.on('disconnect', () => {
            const {nickname, currentRoomId, peerId} = socket.customData;
            console.log(`User ${nickname} with peerId: ${peerId} disconnected completely`);
            if (currentRoomId) {
                socket.to(currentRoomId).emit('user-leave', socket.id);
                socket.leave(currentRoomId);
                util.addCustomSocketData(io, socket.id, {currentRoomId: null});
                console.log(`User ${nickname} with peerId: ${peerId} left roomId ${currentRoomId}`);
            }
        })
    });
    return io;
};

module.exports = initSocketIO;
