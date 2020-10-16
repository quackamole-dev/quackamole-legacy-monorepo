import {SET_PLUGIN} from '../actionTypes';
import {sendDataToConnection} from './connections.actions';

export const setPlugin = plugin => (dispatch, getState) => {
  // temporary simplified action
  if (plugin) {
    dispatch({ type: SET_PLUGIN, payload: { plugin } });
  }
};

const sendPluginMessageToAllConnections = (evt) => (dispatch, getState) => {
  const connections = Object.values(getState().connections.data);
  const data = { type: 'PLUGIN_DATA', payload: evt.data.payload };
  connections.forEach(connection => {
    dispatch(sendDataToConnection(connection.defaultDataChannel, data)); // TODO seperate dataChannel exclusive for plugin data
  });
};

const sendPluginMessageToConnection = (evt) => (dispatch, getState) => {
  const { peerId, payload } = evt.data;
  const connection = getState().connections.data[peerId];
  const data = { type: 'PLUGIN_DATA', payload: payload };
  dispatch(sendDataToConnection(connection.defaultDataChannel, data));
};

// const handlePluginRequestLocalPeer = () => (dispatch, getState) => {
//     try {
//         // TODO verify plugin has PLUGIN_REQUEST_LOCAL_PEER listed in required permissions and user accepted it on start of plugin
//         //  A plugin will have some kind of manifest file (potentially just a .json) for all kinds of metadata like required permissions, name, max users etc
//         // TODO when opening any plugin for the first time, a prompt opens informing user of the required permissions
//         //  he also needs to give his consent by clicking a button which will whitelist the plugin (localstorage for the beginning)
//         const peerId = getState().localUser.peer.id;
//         const data = {type: 'PLUGIN_REQUEST_LOCAL_PEER_GRANT', payload: {peer: peerId}};
//
//         const iframe = getState().plugin.iframe;
//         if (iframe) {
//             iframe.contentWindow.postMessage(data, "*");
//         }
//     } catch (err) {
//         console.error('handleRequestLocalPeer error', err);
//     }
// };

const pluginMessageActions = {
  'PLUGIN_SEND_TO_ALL_PEERS': sendPluginMessageToAllConnections,
  'PLUGIN_SEND_TO_PEER': sendPluginMessageToConnection,
  // 'PLUGIN_REQUEST_LOCAL_PEER': handlePluginRequestLocalPeer,
  'PLUGIN_PLATFORM_CONTROL_REQUEST': () => console.log('plugin is requesting something from the platform (mute local user, rumble screen, etc')
};

export const handlePluginMessage = (evt) => async (dispatch, getState) => {
  if (evt.data.type && evt.data.type.startsWith('PLUGIN')) {
    const action = pluginMessageActions[evt.data.type];
    dispatch(action(evt));
  }
};
