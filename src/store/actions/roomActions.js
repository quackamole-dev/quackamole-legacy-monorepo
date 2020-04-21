import {ADD_ROOMS, CLEAR_ROOMS} from "../actionTypes";
import {API_BASE_URL} from "../../constants";

const addRooms = items => ({
    type: ADD_ROOMS,
    payload: { items }
});

export const clearRooms = items => ({
    type: CLEAR_ROOMS
});

// just a mockup. Will need adjustment to work with socketIO events. Need to research whether thunks work well with socketIO
// Otherwise redux-observables middleware and rxjs might be the better option for bidirectional communication
export const fetchRoom = () => async (dispatch, getState) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/`);
        const data = await response.json();
        dispatch(addRooms(data));
    } catch(error) {
        console.log('could not fetch rooms', error);
    }
};
