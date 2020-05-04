const express = require('express');
const router = express.Router();
const roomManager = require('./rooms');

router.get('/',  (request, response) => {
    response.send('Api base route');
});

// JIMMY: API endpoint/url to create a room (no socket.io involved, you can do a normal http POST request)
// make a POST request to https://localhost:5001/api/rooms to create a room locally.
router.post('/rooms', (request, response) => {
    // This is the data you sent with the fetch in the body
    const name = request.body.name;
    const password = request.body.password;
    const maxUsers = request.body.maxUsers;

    // JIMMY: creating a room via http works the same as with socket.io. Compare this with what is happening in sockets.js on create
    const roomData = {name, password, maxUsers};
    const roomRef = roomManager.createRoom(roomData);

    // JIMMY: If room was created successfully, the roomId will be sent back to the frontend. Use it to generate the link to the room
    const responseData = roomRef && roomRef.id ? roomRef.id : false;
    response.json(responseData);
});

// JIMMY: try making a GET request to this route before implementing the room creation.
// You can fetch it in a useEffect() hook of the CreateRoom component for now. Once that works, refactor it into a POST
// Note Imagine this file being the views.py in django
router.get('/rooms', (request, response) => {
    const rooms = roomManager.getAllRooms(); // Note that it will return the room passwords as well but it does not matter atm.
    response.json(rooms);
});

module.exports = router;
