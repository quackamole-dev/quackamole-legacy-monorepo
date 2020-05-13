const express = require('express');
const router = express.Router();
const roomManager = require('./rooms');

router.get('/',  (request, response) => {
    response.send('Api base route');
});

router.post('/rooms', (request, response) => {
    const name = request.body.name;
    const password = request.body.password;
    const maxUsers = request.body.maxUsers;

    const roomData = {name, password, maxUsers};
    const roomRef = roomManager.createRoom(roomData);

    const responseData = roomRef && roomRef.id ? roomRef.id : false;
    response.json(responseData);
});

router.get('/rooms', (request, response) => {
    const rooms = roomManager.getAllRooms(); // Note that it will return the room passwords as well but it does not matter atm.
    response.json(rooms);
});

module.exports = router;
