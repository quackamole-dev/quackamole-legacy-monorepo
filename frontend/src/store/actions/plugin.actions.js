import {SET_PLUGIN} from "../actionTypes";

export const setPlugin = plugin => (dispatch, getState) => {
    // temporary simplified action
    if (plugin) {
        dispatch({type: SET_PLUGIN, payload: {plugin}});
    }
};

export const broadcastPluginMessageToPeers = (data, iframe) => (dispatch, getState) => {
  const connections = Object.values(getState().connections.data);
  connections.forEach(connection => {
     connection.send(data);
     console.log('--- broadcasting plugin data to connection:', connection.peer);
  });
};
