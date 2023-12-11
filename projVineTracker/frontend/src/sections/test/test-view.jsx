import React, { useState, useEffect, useRef } from 'react';
import { fetchData } from "src/utils";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { func } from 'prop-types';

export default function TestView() {
    // Fetch Data State
    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchDataFromAPI = async () => {
    //         try {
    //             const response = await fetchData('vine/test');
    //             setData(response);
    //             console.log(response);
    //         } catch (error) {
    //             console.error('Error during API call', error);
    //         }
    //     };

    //     fetchDataFromAPI();
    // }, []);

    // WebSocket, has to enable CORS
    const [stompClient, setStompClient] = useState(null);
    const [received, setReceived] = useState([]);

    const connect = () => {
        const socket = new SockJS(`${import.meta.env.VITE_APP_SERVER_URL}:8080/endpoint`);
        const stomp = Stomp.over(socket);
        stomp.connect({}, frame => {
            setStompClient(stomp);
            console.log('Connected: ' + frame);
            stomp.subscribe('/topic/update', greeting => {
                console.log(greeting);
                setReceived([...received, greeting.body]);
            });
        });
    }

    const disconnect = () => {
        if (stompClient) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }



    return (
        <>
            <h2>Received:</h2>
            <ul>
                <li>
                    <button onClick={() => connect()}>Connect</button>
                </li>
            </ul>
        </>
    );
}
