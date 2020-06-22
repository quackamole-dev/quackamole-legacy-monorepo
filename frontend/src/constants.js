export const isLocal = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isLocal ? 'localhost' : process.env.REACT_APP_API_BASE_URL;
export const SSL_ENABLED = isLocal ? false : process.env.REACT_APP_SSL_ENABLED === 'true';

export const PORT_SIGNALING = process.env.REACT_APP_PORT_SIGNALING;
export const PORT_SOCKET = process.env.REACT_APP_PORT_SOCKET;

export const FRONTEND_URL = isLocal ? 'localhost' : process.env.REACT_APP_FRONTEND_URL;
