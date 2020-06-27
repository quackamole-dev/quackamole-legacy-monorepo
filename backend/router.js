const express = require('express');
const router = express.Router();
const roomManager = require('./rooms');

router.get('/',  (request, response) => {
    response.send('Api base route');
});

router.post('/rooms', (request, response) => {
    const {name, password, maxUsers} = request.body;

    const roomData = {name, password, maxUsers};
    const roomRef = roomManager.createRoom(roomData);

    if (roomRef) {
        response.status(201).json(roomRef.id); // FIXME return all room data
    } else {
        response.sendStatus(400);
    }
});

router.get('/rooms', (request, response) => {
    // FIXME in the future differentiate between listed/unlisted rooms
    const rooms = roomManager.getAllRooms(); // Note that it will return the room passwords as well but it does not matter atm.
    response.status(200).json(rooms);
});

router.get('/rooms/:id', (request, response) => {
    const room = roomManager.getRoomById(request.params.id)

    if (room) {
        response.status(200).json(room)
    } else {
        response.sendStatus(404);
    }
});

router.patch('/rooms/:id', (request, response) => {
    // FIXME only allow authorized people to change room data (for the beginning only people in the room, if there is a way to verify that)
    const room = roomManager.getRoomById(request.params.id)

    if (room) {
        roomManager.updateRoom(room.id, request.body);
        response.status(200).json(room)
    } else {
        response.sendStatus(404);
    }
});

module.exports = router;
