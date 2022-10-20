import axios from 'axios';
import { baseUrl } from './constants';

export const _submitInboundSlotForm = async(data) => {
    try {
        return await axios({ method: "post", url: `${baseUrl}/create-slot`, data});
    } catch (error) {
        return error;
    }
}

export const _checkForSlot = async(params) => {
    try {
        return await axios({ method: "get", url: `${baseUrl}/check-slot`, params});
    } catch (error) {
        return error;
    }
}