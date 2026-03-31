import { io } from "socket.io-client";

// Connect to the backend
const hostname = window.location.hostname;
const SOCKET_URL = import.meta.env.VITE_API_URL || `http://${hostname}:5000`;
export const socket = io(SOCKET_URL);
