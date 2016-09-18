export const DEV = process.env.NODE_ENV === 'dev';
export const PORT = process.env.PORT || 9000;
export const FRONT_END = 'http://localhost:8080';
export const API = DEV ? 'http://local.me:9000' : 'http://api.nitpik.me';
