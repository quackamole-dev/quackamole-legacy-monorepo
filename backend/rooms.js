const { v4: uuid } = require('uuid');

// Stores the rooms in memory that were created while the the server is running (rooms are lost when server restarts)
// Redis could be used to store this data later on. That might allow multiple server instances with load balancing
class roomManager {
  constructor() {
    this.rooms = { // TODO try out redis to store roomData
      'dummy-room-id': {
        id: 'dummy-room-id',
        password: 'dummy123',  // TODO hash pws once we start using them to secure rooms.
        name: 'dummy room name',
        maxUsers: 4,
        activePluginId: 'gomoku',
        joinedUsers: []
      }
    };
  }

  createRoom = roomData => {
    const sanitizedRoomData = this._createSanitizedRoomData(roomData);
    this.rooms[sanitizedRoomData.id] = sanitizedRoomData;

    console.log(`Room: ${sanitizedRoomData.name} was created. RoomId: ${sanitizedRoomData.id}`);
    return this.getRoomById(sanitizedRoomData.id);
  };

  doesRoomExist = (roomId) => {
    return !!this.rooms[roomId];
  };

  getRoomById = roomId => {
    return this.rooms[roomId];
  };

  getAllRooms = () => {
    // Note: passwords are NOT included within the returned room data
    return Object.values(this.rooms).map(roomData => {
      const { password, ...otherRoomProperties } = roomData;
      return otherRoomProperties;
    });
  };

  updateRoom = (roomId, data) => {
    const room = this.getRoomById(roomId);

    if (room) {
      const { name, maxUsers, activePluginId } = data;
      // TODO verify data before using it
      room.name = name || room.name;
      room.maxUsers = maxUsers || room.maxUsers;
      room.activePluginId = activePluginId || room.activePluginId;
      return room;
    }
  };

  isPasswordCorrect = (roomId, password) => {
    // const roomRef = this.rooms[roomId];
    // return roomRef.password.length === 0 || roomRef.password === password;
    return true; // FIXME only temporary, password check bypassed until we really need it in v0.2 or v0.3
  };

  _createSanitizedRoomData = rawRoomData => {
    return {
      id: uuid(),
      password: rawRoomData.password || '',
      name: rawRoomData.name || 'default room name',  // TODO use faker to generate some random default names
      maxUsers: rawRoomData.maxUsers || 4,
      joinedUsers: [],
      activePluginId: rawRoomData.activePluginId || ''
    };
  };
}

module.exports = new roomManager();
