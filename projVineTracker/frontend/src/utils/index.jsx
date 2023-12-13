import axios from 'axios';
import { API_BASE_URL } from '../constants';


const fetchData = async (endpoint, token) => {
    try {
        const response = await axios({
            method: "get",
            url: `${API_BASE_URL}/${endpoint}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const postData = async (endpoint, data, token) => {
    try {
        const response = await axios({
            method: "post",
            url: `${API_BASE_URL}/${endpoint}`, 
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: data,
          });
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const deleteData = async (endpoint, token) => {
    try {
        const response = await axios({
            method: "delete",
            url: `${API_BASE_URL}/${endpoint}`, 
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

const updateData = async (endpoint, data, token) => {
    try {
        const response = await axios({
            method: "put",
            url: `${API_BASE_URL}/${endpoint}`, 
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: data,
          });
        return response.data;
    }catch (error) {
        console.log(error);
    }
};

export { fetchData, postData, deleteData, updateData };