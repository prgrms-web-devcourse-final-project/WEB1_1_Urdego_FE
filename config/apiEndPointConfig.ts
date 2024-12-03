export const API_PORT_CONFIG = Object.freeze({
  AUTH: 8081,
  CONTENT: 8082,
  GROUP: 8083,
  NOTIFICATION: 8085,
});

export const API_URL_CONFIG = Object.freeze({
  CONTENT: {
    POST_MULTIPLE: '/api/content-service/contents/multiple',
    POST_SINGLE: '/api/content-service/contents/',
  },
  AUTH: {
    SIGNUP: '/api/auth/user-service/users',
    LOGIN: '/api/user-service/login',
  },
});

export const API_BASE_URL = Object.freeze({
  API: 'https://3.39.135.47:443',
  OAUTH: 'http://3.39.135.47:8081',
  NOTIFICATION: 'https://3.39.135.47:8085',
  GROUP: 'http://3.39.135.47:8083',
  DNS: 'https://urdego.com',
});
