const {v4: uuid} = require('uuid');

// Stores the rooms in memory that were created while the the server is running.
// Rooms are NOT persisted yet. The are gone once the server restarts.
// This roomManager is temporary. The room data will be persisted with mongoDB later on.
class roomManager {
    constructor() {
        this.rooms = {
            'dummy-room-id': {
                id: 'dummy-room-id',
                password: 'dummy123',
                name: 'dummy room name',
                joinedUsers: [],
                maxUsers: 4
            }
        }
    }

    createRoom = roomData => {
        console.log('create');

        const sanitizedRoomData = this._createSanitizedRoomData(roomData);
        this.rooms[sanitizedRoomData.id] = sanitizedRoomData;
        return this.getRoom(sanitizedRoomData.id);
    };

    joinRoom = (roomId, peerId, password) => {
        const roomRef = this.rooms[roomId];
        console.debug('join');

        if (roomRef) {
            if (!roomRef.joinedUsers) { roomRef.joinedUsers = [] }

            if (this._checkRoomPassword(roomId, password)) {
                if (roomRef.joinedUsers.includes(user => user.peerId === peerId)) {
                    console.log(`user ${peerId} has already joined the room: ${roomRef.id}`);
                    return false;
                }
                roomRef.joinedUsers.push({peerId: peerId});
                console.log(`user ${peerId} successfully joined the room: ${roomRef.id}`);
                return roomRef;
            } else {
                console.log('user provided wrong password');
                return false;
            }
        }
    };

    doesRoomExist = (roomId) => {
        return !!this.rooms[roomId];
    };

    getRoom = roomId => {
        const roomRef = this.rooms[roomId];
        if (roomRef) {
            return {
                id: roomRef.id,
                name: roomRef.name,
                maxUsers: roomRef.maxUsers,
                joinedUsers: roomRef.joinedUsers,
            }
        }
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
