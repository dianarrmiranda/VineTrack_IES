import axios from 'axios';
import { API_BASE_URL } from '../constants';

const fecthData = async (endpoint) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const postData = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const deleteData = async (endpoint) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const updateData = async (endpoint, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

export { fecthData, postData, deleteData, updateData };