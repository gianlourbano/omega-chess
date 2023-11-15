import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_BASE_URL = "http://127.0.0.1:8085"

export const useSocket = (room, username) => {
  const [socket, setSocket] = useState(null);
  const [socketResponse, setSocketResponse] = useState("");
  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    (event, payload) => {
      socket.emit(event, payload);
    },
    [socket, room]
  );
  useEffect(() => {
    const s = io(SOCKET_BASE_URL, {
      reconnection: false,
      query: `username=${username}&room=${room}`, //"room=" + room+",username="+username,
    });
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("read_message", (res) => {
      console.log(res);
      setSocketResponse(res);
    });
    return () => {
      s.disconnect();
    };
  }, [room]);

  return { socket, sendData, socketResponse, isConnected};
};