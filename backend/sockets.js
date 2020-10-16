const IOServer = require('socket.io');
const roomManager = require('./rooms');
const { SocketCustomError } = require('./errors');
// const url = require('url')
// const base64id = require('base64id')

const util = {
  getSocketCustomData: (io, socketId) => {
    const socket = io.nsps['/'].sockets[socketId]; // https://stackoverflow.com/a/47096361
    return socket ? socket.customData : false;
  },
  addCustomSocketData: (io, socketId, addedCustomData) => {
    let socket = io.nsps['/'].sockets[socketId];
    if (socket) {
      if (!socket.customData) {
        socket.customData = {};
      }
      return io.nsps['/'].connected[socketId].customData = { ...socket.customData, ...addedCustomData };
    }
  },
  getSocketIdsInRoom: (io, roomId) => {
    const room = io.sockets.adapter.rooms[roomId];
    return room ? Object.keys(room.sockets) : [];
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
  socket.on('join', ({ roomId, password }, callback) => {
    // TODO roomManager should be renamed into roomUtils if join room logic is outside of it.
    if (!roomManager.doesRoomExist(roomId)) {
      return callback(new SocketCustomError('RoomError', 'This room does not exist.'));
    }

    if (util.socketAlreadyInRoom(socket, roomId)) {
      return callback(new SocketCustomError('RoomError', 'You are already in this room.'));
    }

    if (!roomManager.isPasswordCorrect(roomId, password)) {
      return callback(new SocketCustomError('RoomError', 'Wrong password provided.'));
    }

    const roomRef = roomManager.getRoomById(roomId);
    const numJoinedUsers = util.getSocketIdsInRoom(io, roomRef.id).length;
    if (numJoinedUsers >= roomRef.maxUsers) {
      return callback(new SocketCustomError('RoomError', 'This room is already full.'));
    }

    util.addCustomSocketData(io, socket.id, { currentRoomId: roomRef.id });
    socket.join(roomRef.id);
    socket.to(roomRef.id).emit('user-join', roomRef);

    roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
    callback(null, { room: roomRef });
  });

  // Leave room
  socket.on('leave', (roomId) => {
    socket.to(roomId).emit('user-leave', socket.id);
    socket.leave(roomId);
    const { nickname, currentRoomId } = util.getSocketCustomData(io, socket.id);
    console.log(`User ${nickname} with socketId: ${socket.id} left roomId ${currentRoomId}`);
    util.addCustomSocketData(io, socket.id, { currentRoomId: null });

    const roomRef = roomManager.getRoomById(currentRoomId);
    roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
    // TODO reduce code duplication. There is a "leave" and a in-built "disconnect" event-listener doing similar things
  });

  socket.on('offer', ({ receiverSocketId, offer }) => {
    const nickname = socket.handshake.query['nickname'];
    console.log(`User ${nickname} with socketID: ${socket.id} send an offer to socketID: ${receiverSocketId}`);
    io.to(receiverSocketId).emit('offer', { senderSocketId: socket.id, offer: offer });
  });

  socket.on('answer', ({ receiverSocketId, answer }) => {
    const nickname = socket.handshake.query['nickname'];
    console.log(`User ${nickname} with socketID: ${socket.id} send an answer to socketID: ${receiverSocketId}`);
    io.to(receiverSocketId).emit('answer', { senderSocketId: socket.id, answer: answer });
  });

  socket.on('ice-candidates', ({ senderSocketId, receiverSocketId, iceCandidates }) => {
    const nickname = socket.handshake.query['nickname'];
    console.log(`User ${nickname} with socketID: ${socket.id} send ${iceCandidates.length}x ICE Candidates to socketID: ${receiverSocketId}`);
    io.to(receiverSocketId).emit('ice-candidates', { senderSocketId, iceCandidates });
  });
};

const initSocketIO = (server) => {
  const io = IOServer.listen(server);

  // // Overwrite default ID generation. Based on this: https://stackoverflow.com/a/63176671 (experimental)
  // io.engine.generateId = req => {
  //     const parsedUrl = new url.parse(req.url)
  //     const prevId = parsedUrl.searchParams.get('socketId')
  //     // prevId is either a valid id or an empty string
  //     if (prevId) {
  //         return prevId
  //     }
  //     return base64id.generateId()
  // }

  io.on('connection', function (socket) {
    // Send to connected client because on the clientside socket.id is sometimes undefined after connecting
    io.to(socket.id).emit('ready', socket.id);

    // Arbitrary data can be send from the frontend via query params.
    const nickname = socket.handshake.query['nickname'];
    socket.customData = { nickname: nickname };
    console.log('User with nickname:', nickname, 'connected. socketId:', socket.id);

    // Init user triggered actions
    initSocketActions(io, socket);

    // Cleanup when client disconnects
    socket.on('disconnect', () => {
      const { nickname, currentRoomId } = socket.customData;
      console.log(`DISCONNECT: User ${nickname} with socketId: ${socket.id} disconnected completely`);
      if (currentRoomId) {
        socket.to(currentRoomId).emit('user-leave', socket.id);
        socket.leave(currentRoomId);
        util.addCustomSocketData(io, socket.id, { currentRoomId: null });
        console.log(`DISCONNECT: User ${nickname} with socketId: ${socket.id} left roomId ${currentRoomId}`);

        const roomRef = roomManager.getRoomById(currentRoomId);
        roomRef.joinedUsers = util.getSocketIdsInRoom(io, roomRef.id);
      }
    });
  });
  return io;
};

module.exports = initSocketIO;
