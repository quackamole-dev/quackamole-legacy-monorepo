import {SET_PLUGIN, SET_PLUGIN_ERROR} from '../actionTypes';
import produce from 'immer'

// TODO there should be a plugins.reducer storing the plugin data of already fetched plugins (once they come from the backend)
//  activePluginId should be stored in the room.reducer, as well as pluginIds that are shown in the room sidebar.
//  plugin data can be fetched from the backend (or could already be included when fetching the room)
const initialState = {
    // origin: 'null',
    iframe: null,
    url: '',
    name: 'p2p-test-plugin',
    error: null
};

const pluginReducer = produce((pluginDraft, action) => {
    switch (action.type) {
        case SET_PLUGIN: {
            const {url, name, iframe} = action.payload.plugin;
            pluginDraft.iframe = iframe;
            pluginDraft.url = url;
            pluginDraft.name = name;
            pluginDraft.error = null;
            return;
        }
        case SET_PLUGIN_ERROR: {
            pluginDraft.error = action.payload.error;
            return;
        }
        default: {}
    }
}, initialState);

export default pluginReducer;
