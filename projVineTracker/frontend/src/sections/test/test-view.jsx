import React, { useState, useEffect, useRef } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from 'src/constants';


export default function TestView() {


    // WebSocket, has to enable CORS
    const [stompClient, setStompClient] = useState(null);
    const [received, setReceived] = useState([]);

    const connect = () => {
        const socket = new SockJS(`${API_BASE_URL}/endpoint`);
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
