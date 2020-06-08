import {SET_PLUGIN} from "../actionTypes";
import {sendDataToConnection} from "./connections.actions";

export const setPlugin = plugin => (dispatch, getState) => {
    // temporary simplified action
    if (plugin) {
        dispatch({type: SET_PLUGIN, payload: {plugin}});
    }
};

const sendPluginMessageToAllConnections = (evt) => (dispatch, getState) => {
    const connections = Object.values(getState().connections.data);
    const data = {type: 'PLUGIN_DATA', payload: evt.data.payload};
    console.log('PLUGIN_SEND_TO_ALL_PEERS', data);
    connections.forEach(connection => {
         dispatch(sendDataToConnection(connection, data));
     });
};

const sendPluginMessageToConnection = (evt) => (dispatch, getState) => {
    const {peerId, payload} = evt.data;
    const connection = getState().connections.data[peerId];
    const data = {type: 'PLUGIN_DATA', payload: payload};
    dispatch(sendDataToConnection(connection, data));
};

const pluginMessageActions = {
    'PLUGIN_SEND_TO_ALL_PEERS': sendPluginMessageToAllConnections,
    'PLUGIN_SEND_TO_PEER': sendPluginMessageToConnection,
    'PLUGIN_PLATFORM_CONTROL_REQUEST': () => console.log('plugin is requesting something from the platform (mute local user, rumble screen, etc')
};

export const handlePluginMessage = (evt) => async (dispatch, getState) => {
    if (evt.data.type && evt.data.type.startsWith('PLUGIN')) {
        const action = pluginMessageActions[evt.data.type];
        dispatch(action(evt))
    }
}

