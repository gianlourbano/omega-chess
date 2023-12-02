package com.balottacpp.backend.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.balottacpp.backend.constants.Constants;
import com.balottacpp.backend.model.DarkboardGame;
import com.balottacpp.backend.model.Game;
import com.balottacpp.backend.model.OnlineGame;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class SocketModule {

    private final HashMap<String, Game> games = new HashMap<>();
    

    @Data
    @AllArgsConstructor
    public class SocketClientData {
        public SocketIOClient client;
        public String username;
        public String room;
        public String gameType;
        public String token;

        public boolean equals(SocketClientData other) {
            return this.client.getSessionId().equals(other.client.getSessionId());
        }
    }

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
        server.addEventListener("ready", String.class, onPlayerReady());
    }

    // private DataListener<Message> onChatReceived() {
    // return (senderClient, data, ackSender) -> {
    // log.info(data.toString());
    // socketService.saveMessage(senderClient, data);
    // };
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

    private DataListener<String> onPlayerReady() {
        return (client, data, ackSender) -> {
            var params = client.getHandshakeData().getUrlParams();
            String gameType = "";
            try {
                gameType = params.get("gameType").stream().collect(Collectors.joining());
            } catch (Exception e) {
                client.sendEvent("error", "gameType is required");
                client.disconnect();
            }
            String room, username, token;

            switch (gameType) {
                case Constants.GAME_TYPE_DARKBOARD:
                    break;
                case Constants.GAME_TYPE_DEVELOPER:
                    break;
                case Constants.GAME_TYPE_ONLINE: {

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    log.info("Player {} is ready in room {}",
                            username, room);

                    int connectedPlayers = server.getRoomOperations(room).getClients().size();

                    if(connectedPlayers < 2) {
                        Game game = new OnlineGame(gameType);
                        games.put(room, game);
                        System.out.println("error here if");
                        game.whiteConnected(client, username);
                        
                    } else if( connectedPlayers == 2) {
                        System.out.println("error here else");
                        Game game = games.get(room);
                        game.blackConnected(client, username);
                    } else {
                        client.sendEvent("error", "Room is full");
                        client.disconnect();
                    }

                    break;
                }
                default:
                    client.sendEvent("error", "gameType is invalid");
                    client.disconnect();
                    return;
            }
        };
    }

    private ConnectListener onConnected() {
        return (client) -> {
            // String room = client.getHandshakeData().getSingleUrlParam("room");
            // String username = client.getHandshakeData().getSingleUrlParam("room");
            var params = client.getHandshakeData().getUrlParams();
            String gameType = "";
            try {
                gameType = params.get("gameType").stream().collect(Collectors.joining());
            } catch (Exception e) {
                client.sendEvent("error", "gameType is required");
                gameType = "darkboard";
            }
            String room, username, token;

            switch (gameType) {
                case Constants.GAME_TYPE_DARKBOARD:
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    client.joinRoom(room);
                    log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to server [mode: {}]",
                            client.getSessionId().toString(), room, username, gameType);
                    break;
                case Constants.GAME_TYPE_DEVELOPER:

                    try {
                        token = params.get("token").stream().collect(Collectors.joining());
                    } catch (Exception e) {
                        client.sendEvent("error", "token is required");
                        client.disconnect();
                        return;
                    }

                    try {
                        username = params.get("username").stream().collect(Collectors.joining());
                    } catch (Exception e) {
                        client.sendEvent("error", "username is required");
                        client.disconnect();
                        return;
                    }

                    room = token + username;

                    client.joinRoom(room);

                    log.info("Socket ID[{}] - token[{}] - username [{}]  Connected to server [mode: {}]",
                            client.getSessionId().toString(), token, username, gameType);

                    break;
                case Constants.GAME_TYPE_ONLINE: {
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    log.info("Socket ID[{}] - room[{}] - username [{}]  Connected to server [mode: {}]",
                            client.getSessionId().toString(), room, username, gameType);
                    client.joinRoom(room);
                    int size = server.getRoomOperations(room).getClients().size();
                    System.out.println(size);

                    break;
                }
                default:
                    client.sendEvent("error", "gameType is invalid");
                    client.disconnect();
                    return;
            }
            // socketService.createNewGame(client, room);
        };

    }

    private DataListener<String> onReady() {
        return (senderClient, data, ackSender) -> {
            var params = senderClient.getHandshakeData().getUrlParams();
            String room = params.get("room").stream().collect(Collectors.joining());
            String username = params.get("username").stream().collect(Collectors.joining());
            log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                    senderClient.getSessionId().toString(), room, username, data);
            ackSender.sendAckData();
            socketService.createNewGame(senderClient, username, "Darkboard", room);

        };
    }

    private DataListener<String> onMoveReceived() {
        return (client, data, ackSender) -> {
            var params = client.getHandshakeData().getUrlParams();
            String gameType = "";
            try {
                gameType = params.get("gameType").stream().collect(Collectors.joining());
            } catch (Exception e) {
                client.sendEvent("error", "gameType is required");
                gameType = "darkboard";
            }
            String room, username, token;


            switch(gameType) {
                case Constants.GAME_TYPE_DARKBOARD:
                    break;
                case Constants.GAME_TYPE_DEVELOPER:
                    break;
                case Constants.GAME_TYPE_ONLINE: {
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                            client.getSessionId().toString(), room, username, data);
                    
                    Game game = games.get(room);
                    game.makeMove(data, username);

                    break;
                }
                default:
                    client.sendEvent("error", "gameType is invalid");
                    client.disconnect();
                    return;
            }
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            var params = client.getHandshakeData().getUrlParams();

            String gameType = params.get("gameType").stream().collect(Collectors.joining());

            String room, username, token;

            switch (gameType) {
                case Constants.GAME_TYPE_DARKBOARD:
                    break;
                case Constants.GAME_TYPE_DEVELOPER:
                    token = params.get("token").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    room = token + username;
                    client.leaveRoom(room);
                    log.info("Socket ID[{}] - token[{}] - username [{}]  disconnected [mode: {}]",
                            client.getSessionId().toString(), token, username, gameType);
                    break;
                case Constants.GAME_TYPE_ONLINE:
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through",
                            client.getSessionId().toString(), room, username);
                    client.leaveRoom(room);
                    socketService.endGame(client, room);

                    break;
                default:
                    break;
            }
        };
    }

}
