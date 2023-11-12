import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_BASE_URL = "http://192.168.1.5:8085"

export const useSocket = (room, username) => {
  const [socket, setSocket] = useState();
  const [socketResponse, setSocketResponse] = useState({
    room: "",
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });
  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    (payload) => {
      socket.emit("send_message", {
        room: room,
        content: payload.content,
        username: username,
        messageType: "CLIENT",
      });
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
      setSocketResponse({
        room: res.room,
        content: res.content,
        username: res.username,
        messageType: res.messageType,
        createdDateTime: res.createdDateTime,
      });
    });
    return () => {
      s.disconnect();
    };
  }, [room]);

  return { socketResponse, isConnected, sendData };
};