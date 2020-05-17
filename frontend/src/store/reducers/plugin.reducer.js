import {SET_PLUGIN, SET_PLUGIN_ERROR} from '../actionTypes';

const initialState = {
    // origin: 'null',
    url: '',
    name: 'p2p-test-plugin',
    error: null
};

const pluginReducer = (plugin = initialState, action) => {
    switch (action.type) {
        case SET_PLUGIN: {
            return {...plugin, ...action.payload.plugin, error: null};
        }
        case SET_PLUGIN_ERROR: {
            return {...plugin, error: action.payload.error}
        }
        default: {
            return plugin;
        }
    }
};

export default pluginReducer;

