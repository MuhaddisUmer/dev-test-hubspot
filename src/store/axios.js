import axios from 'axios';
import { ApiUrl, token } from './config';

axios.defaults.baseURL = ApiUrl;
axios.defaults.headers.common['Access-Control-Max-Age'] = "1800";
axios.defaults.headers.common['Access-Control-Allow-Host'] = "*";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = "true";
axios.defaults.headers.common['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept";
axios.defaults.headers.common['Access-Control-Allow-Methods'] = "PUT, POST, GET, DELETE, PATCH, OPTIONS";
axios.defaults.headers.common['Content-Type'] = "application/json;charset=utf-8";

if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

