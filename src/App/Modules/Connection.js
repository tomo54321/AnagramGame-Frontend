import io from 'socket.io-client';

export const socket = io("http://localhost:8080", {
    path: "/",
    autoConnect: false,
    reconnection: false,
    query: {}
});