const {v4: uuid} = require('uuid');

// Stores the rooms in memory that were created while the the server is running (rooms are lost when server restarts)
// Redis could be used to store this data later on. That might allow multiple server instances with load balancing
class roomManager {
    constructor() {
        this.rooms = {
            'dummy-room-id': {
                id: 'dummy-room-id',
                password: 'dummy123',
                name: 'dummy room name',
                // joinedUsers: [], // not stored in here. Taken dynamically out of socketIOs internal state
                maxUsers: 4
            }
        }
    }

    createRoom = roomData => {
        const sanitizedRoomData = this._createSanitizedRoomData(roomData);
        this.rooms[sanitizedRoomData.id] = sanitizedRoomData;

        console.log(`Room: ${sanitizedRoomData.name} was created. RoomId: ${sanitizedRoomData.id}`);
        return this.getRoomById(sanitizedRoomData.id);
    };

    joinRoom = (roomId, peerId, password) => {
        const roomRef = this.rooms[roomId];
        console.log(`User: ${peerId} is attempting to join the roomId: ${roomId}`);

        if (roomRef) {
            if (this._checkRoomPassword(roomId, password)) {
                console.log(`User: ${peerId} provided the correct password for room: ${roomId}`);
                return roomRef;
            } else {
                console.log(`User: ${peerId} provided the wrong password for room: ${roomId}`);
                return false;
            }
        }
    };

    leaveRoom = (roomId, peerId) => {
        const roomRef = this.rooms[roomId];

        if (roomRef.joinedUsers.includes(user => user.peerId === peerId)) {
            roomRef.joinedUsers.filter(user => user !== peerId);
            return roomRef;
        } else {
            console.log(`The user: ${peerId} is not in this room, therefore cannot leave`);
            return false;
        }
    };

    doesRoomExist = (roomId) => {
        return !!this.rooms[roomId];
    };

    getRoomById = roomId => {
        const roomRef = this.rooms[roomId];
        if (roomRef) {
            return {
                id: roomRef.id,
                name: roomRef.name,
                maxUsers: roomRef.maxUsers,
            }
        }
    };

    getAllRooms = () => {
        // Note: passwords of the rooms are returned as well but right now it does not matter
        return this.rooms;
    };

    _checkRoomPassword = (roomId, password) => {
        const roomRef = this.rooms[roomId];
        return roomRef.password.length === 0 || roomRef.password === password;
    };

    _createSanitizedRoomData = rawRoomData => {
        return {
            id: uuid(),
            password: rawRoomData.password,
            name: rawRoomData.name,
            maxUsers: rawRoomData.maxUsers,
            joinedUsers: [],
        }
    };
}

module.exports = new roomManager();
