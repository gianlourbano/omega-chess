package com.balottacpp.backend.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.balottacpp.backend.constants.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@Slf4j
public class SocketModule {

    private final SocketIOServer server;
    private final SocketService socketService;

    public SocketModule(SocketIOServer server, SocketService socketService) {
        this.server = server;
        this.socketService = socketService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        // server.addEventListener("send_message", Message.class, onChatReceived());
        server.addEventListener("make_move", String.class, onMoveReceived());
        server.addEventListener("start_game", String.class, onReady());
        server.addEventListener("resign_game", String.class, onResignReceived());    
        server.addEventListener("game_finished", String.class, onGameFinished());
    }

    // private DataListener<Message> onChatReceived() {
    //     return (senderClient, data, ackSender) -> {
    //         log.info(data.toString());
    //         socketService.saveMessage(senderClient, data);
    //     };
    // }

    private DataListener<String> onGameFinished() {
        return (senderClient, data, ackSender) -> {
            var params = senderClient.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                    senderClient.getSessionId().toString(), room, username, data);
            socketService.endGame(senderClient, room);
        };
    }

    private DataListener<String> onResignReceived() {
        return (senderClient, data, ackSender) -> {
            var params = senderClient.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                    senderClient.getSessionId().toString(), room, username, data);
            socketService.resignGame(senderClient, room);
        };
    }

    private ConnectListener onConnected() {
        return (client) -> {
            // String room = client.getHandshakeData().getSingleUrlParam("room");
            // String username = client.getHandshakeData().getSingleUrlParam("room");
            var params = client.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            client.joinRoom(room);
            log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to chat module through",
                    client.getSessionId().toString(), room, username);
            //socketService.createNewGame(client, room);
        };

    }

    private DataListener<String> onReady() {
        return (senderClient, data, ackSender) -> {
            var params = senderClient.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                    senderClient.getSessionId().toString(), room, username, data);
            socketService.createNewGame(senderClient, room);
        };
    }

    private DataListener<String> onMoveReceived() {
        return (senderClient, data, ackSender) -> {
            var params = senderClient.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                    senderClient.getSessionId().toString(), room, username, data);
            boolean res = socketService.makeMove(senderClient, room, data);

            ackSender.sendAckData(res ? "valid" : "invalid");
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            var params = client.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through",
                    client.getSessionId().toString(), room, username);
            client.leaveRoom(room);
            socketService.printGameInfo();
        };
    }

}
