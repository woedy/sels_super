const envBase = process.env.REACT_APP_BASE_URL || "http://localhost:5050";
const envMedia = process.env.REACT_APP_BASE_URL_MEDIA || envBase;
const envWs = process.env.REACT_APP_BASE_URL_WS_URL || envBase.replace(/^http/i, "ws");

export const baseUrl = envBase.endsWith("/") ? envBase : envBase + "/";
export const baseUrlMedia = envMedia;
export const baseWsUrl = envWs.endsWith("/") ? envWs : envWs + "/";

export const userToken = localStorage.getItem('token');


