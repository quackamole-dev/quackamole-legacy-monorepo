export const IS_LOCALHOST = process.env.NODE_ENV === 'development';

export const API_BASE_URL = IS_LOCALHOST ? 'localhost' : process.env.REACT_APP_API_BASE_URL;
export const SSL_ENABLED = IS_LOCALHOST ? false : process.env.REACT_APP_SSL_ENABLED === 'true';

export const PORT_SOCKET = process.env.REACT_APP_PORT_SOCKET;

export const FRONTEND_URL = IS_LOCALHOST ? 'localhost' : process.env.REACT_APP_FRONTEND_URL;
