import { combineReducers } from 'redux';
import rooms from './rooms';
import peers from './peers';

const reducer = combineReducers({
    rooms,
    peers
});

export default reducer;
