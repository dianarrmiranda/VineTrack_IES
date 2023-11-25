import React, { useState, useEffect, useRef } from 'react';
import { fetchData } from "src/utils";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

export default function TestView() {
    // Fetch Data State
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const response = await fetchData('vine/test');
                setData(response);
                console.log(response);
            } catch (error) {
                console.error('Error during API call', error);
            }
        };

        fetchDataFromAPI();
    }, []);

    // WebSocket
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/track/updates', (message) => {
                setMessages((prevMessages) => [...prevMessages, message.body]);
            });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [messages]); // Include messages in the dependency array

    return (
        <>
            <h2>Received:</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </>
    );
}
