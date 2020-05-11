// import {SET_CALLS, ADD_CONNECTION, SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR, SET_PEERS} from '../actionTypes';
//
// const initialState = {
//     data: {
//         id: 'dummy-room-id',
//         name: 'Dummy Room',
//         peers: [
//             'd7f7saim3',
//             '32mfdnmio',
//         ],
//         connections: [
//             'd7f7saim3',
//             '32mfdnmio',
//         ],
//         calls: [
//             'd7f7saim3',
//             '32mfdnmio',
//         ]
//     },
//     error: null
// };
//
// const roomReducer = (room = initialState, action) => {
//     switch (action.type) {
//         case SET_CURRENT_ROOM: {
//             return {data: action.payload.room, error: null};
//         }
//         case SET_CURRENT_ROOM_ERROR: {
//             return {data: room.data, error: action.payload.error};
//         }
//         case SET_PEERS: {
//             const peers = Object.keys(action.payload.peers);
//             return {data: room.data, peers, error: null};
//         }
//         case ADD_CONNECTION: {
//             // const connections = Object.keys(action.payload.connections);
//             // return {data: room.data, connections, error: null};
//             return room;
//         }
//         case SET_CALLS: {
//             const calls = Object.keys(action.payload.calls);
//             return {data: room.data, calls, error: null};
//         }
//         default: {
//             return room;
//         }
//     }
// };
//
// export default roomReducer;
