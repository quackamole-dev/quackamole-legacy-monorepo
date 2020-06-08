const {v4: uuid} = require('uuid');

// Stores the rooms in memory that were created while the the server is running (rooms are lost when server restarts)
// Redis could be used to store this data later on. That might allow multiple server instances with load balancing
class roomManager {
    constructor() {
        this.rooms = { // TODO try out redis to store roomData
            'dummy-room-id': {
                id: 'dummy-room-id',
                password: 'dummy123',  // TODO hash pws once we start using them to secure rooms.
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
        return this.rooms[roomId];
    };

    getAllRooms = () => {
        // Note: passwords of the rooms are returned as well but right now it does not matter
        return this.rooms;
    };

    isPasswordCorrect = (roomId, password) => {
        // const roomRef = this.rooms[roomId];
        // return roomRef.password.length === 0 || roomRef.password === password;
        return true; // FIXME only temporary, password check bypassed until we really need it in v0.2 or v0.3
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
