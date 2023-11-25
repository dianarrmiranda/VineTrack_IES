import React, { useState, useEffect } from 'react';
import { fetchData } from "src/utils";

export default function TestView() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const response = await fetchData('vine/test'); // Assuming fetchData is an async function

                // Assuming the response is JSON data; modify this part based on your API response format
                setData(response);
                console.log(response);
            } catch (error) {
                console.error('Error during API call', error);
            }
        };

        fetchDataFromAPI();
    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <h1>Test</h1>
            <p>{data.value}</p>
        </>
    );
}