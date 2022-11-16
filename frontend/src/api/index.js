import axios from 'axios';
import { getSession } from '../util/helpers';
import { baseUrl } from './constants';

const client = axios;
export const setAuthToken = (token) => {
    axios.defaults.headers['authorization'] = `Bearer ${token}`;
    document.cookie = `authorization=${token}`;
};

export const _submitInboundSlotForm = async(data) => {
    try {
        return await request({ method: "post", url: `${baseUrl}/create-slot`, data});
    } catch (error) {
        return error;
    }
}

export const _checkForSlot = async(params) => {
    try {
        return await request({ method: "get", url: `${baseUrl}/check-slot`, params});
    } catch (error) {
        return error;
    }
}

export const signIn = async(payload) => {
    try {
        return await client.post(`${baseUrl}/auth/login`,payload);
    } catch (error) {
        return error;
    }
}

async function request(method, url, data = {}, params = {},headers = {}) {
    try {
        return await client({
            method: method,
            url: `${baseUrl}${url}`,
            data: data,
            params: params,
            headers:{
                Authorization : `Bearer ${getSession()}`,
                ...headers
            }
        });
    } catch (e) {
        console.log(e)
    }
}