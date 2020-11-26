import { useEffect } from "react";
import io from "socket.io-client";
import { URL, SOCKET_URL } from "../constants/constants"

export const socket = io(URL, { transports: ['websocket'] })