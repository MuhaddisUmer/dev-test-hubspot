import axios from 'axios';
import { ApiUrl, token } from './config';

axios.defaults.baseURL = ApiUrl;

axios.defaults.headers.common['Content-Type'] = "application/json;charset=utf-8";
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

