import axios, { AxiosInstance } from 'axios';

const TIMEOUT = 30_000;
const JSON_HEADERS = {
  'content-type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export const rapidApiFootballUrl: AxiosInstance = axios.create({
  baseURL: process.env['CACHE_SERVER_URL'],
  timeout: TIMEOUT,
  headers: { ...JSON_HEADERS, token: process.env['CACHE_SERVER_TOKEN'] },
});

export const monksFootballUrl: AxiosInstance = axios.create({
  baseURL: process.env['SPORTMONKS_FOOTBALL_URL'],
  timeout: TIMEOUT,
  headers: { ...JSON_HEADERS, token: process.env['SPORTMONKS_API_TOKEN'] },
});

export const monksFootballUrl4: AxiosInstance = axios.create({
  baseURL: process.env['SPORTMONKS_FOOTBALL_URL_V4'],
  timeout: TIMEOUT,
  headers: { ...JSON_HEADERS, token: process.env['SPORTMONKS_API_TOKEN'] },
});

export const proxyCheckUrl: AxiosInstance = axios.create({
  baseURL: process.env['PROXY_SERVER_URL'],
  timeout: TIMEOUT,
  headers: { ...JSON_HEADERS, 'x-access-key': process.env['PROXY_SERVER_TOKEN'] },
});

export const adsUrlIos: AxiosInstance = axios.create({
  baseURL: process.env['AD_SERVER_URL_BASE_URL'],
  timeout: TIMEOUT,
  headers: {
    ...JSON_HEADERS,
    'x-platform': process.env['AD_SERVICE_PLATFORM_KEY_IOS'],
    'im-platform-id': process.env['AD_SERVICE_ID_IOS'],
    'x-api-key': process.env['AD_SERVER_BASE_API_KEY'],
  },
});

export const adsUrlAndroid: AxiosInstance = axios.create({
  baseURL: process.env['AD_SERVER_URL_BASE_URL'],
  timeout: TIMEOUT,
  headers: {
    ...JSON_HEADERS,
    'x-platform': process.env['AD_SERVICE_PLATFORM_KEY_ANDROID'],
    'im-platform-id': process.env['AD_SERVICE_ID_ANDROID'],
    'x-api-key': process.env['AD_SERVER_BASE_API_KEY'],
  },
});
