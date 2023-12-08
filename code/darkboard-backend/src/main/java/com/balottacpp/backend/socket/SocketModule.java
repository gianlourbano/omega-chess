package com.balottacpp.backend.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.balottacpp.backend.constants.Constants;
import com.balottacpp.backend.model.DarkboardGame;
import com.balottacpp.backend.model.DeveloperGame;
import com.balottacpp.backend.model.Game;
import com.balottacpp.backend.model.OnlineGame;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/")
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

    public SocketModule(SocketIOServer server) {
        this.server = server;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        // server.addEventListener("send_message", Message.class, onChatReceived());
        server.addEventListener("make_move", String.class, onMoveReceived());
        server.addEventListener("resign_game", String.class, onResignReceived());
        server.addEventListener("ready", String.class, onPlayerReady());
    }

    // TODO: implement offer draw
    private DataListener<String> onOfferDrawReceived() {
        return (client, data, ackSender) -> {

        };
    }

    private DataListener<String> onResignReceived() {
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

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    if (Constants.DEBUG)
                        log.info("Player {} is ready in room {}",
                                username, room);

                    Game dbgame = games.get(room);
                    dbgame.resignGame(username);

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

                    Game devgame = games.get(room);
                    devgame.resignGame(username);
                    break;
                case Constants.GAME_TYPE_ONLINE: {

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    Game game = games.get(room);
                    game.resignGame(username);
                    break;
                }
                default:
                    return;
            }
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

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    if (Constants.DEBUG)
                        log.info("Player {} is ready in room {}",
                                username, room);

                    Game dbgame = new DarkboardGame(room, username, "Darkboard", client);
                    games.put(room, dbgame);

                    // start the game in a different thread

                    new Thread(() -> {
                        dbgame.startGame();
                    }).start();

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

                    Game devgame = new DeveloperGame(client);
                    games.put(room, devgame);

                    // start the game in a different thread
                    new Thread(() -> {
                        devgame.startGame();
                    }).start();

                    break;
                case Constants.GAME_TYPE_ONLINE: {

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    String color = params.get("color").stream().collect(Collectors.joining());

                    if (Constants.DEBUG)
                        log.info("Player {} is ready in room {}",
                                username, room);

                    int connectedPlayers = server.getRoomOperations(room).getClients().size();

                    Game g = games.get(room);
                    if (g != null && (g.getStatusBit(Game.PLAYING) != 0)) {
                        if ((!g.getUsername("white").equals(username) && !g.getUsername("black").equals(username))) {
                            client.sendEvent("error", "You are not a player in this game");
                            client.disconnect();
                            return;
                        } else {
                            System.out.println("Reconnecting player: " + username);
                            g.handleReconnect(client, username);
                            return;
                        }

                    }

                    if (color.equals("white")) {
                        Game game;
                        if (connectedPlayers == 1) {
                            game = new OnlineGame(gameType, room);
                            games.put(room, game);
                            game.whiteConnected(client, username);
                            game.setStatusBitOn(Game.WAITING_FOR_BLACK);
                        } else if (connectedPlayers == 2) {
                            game = games.get(room);
                            game.whiteConnected(client, username);
                            game.setStatusBitOn(Game.READY_TO_START);
                            game.initGame();
                        } else {
                            client.sendEvent("error", "Room is full");
                            client.disconnect();
                        }

                    } else if (color.equals("black")) {
                        Game game;
                        if (connectedPlayers == 1) {
                            game = new OnlineGame(gameType, room);
                            games.put(room, game);
                            game.blackConnected(client, username);
                            game.setStatusBitOn(Game.WAITING_FOR_WHITE);
                        } else if (connectedPlayers == 2) {
                            game = games.get(room);
                            game.blackConnected(client, username);

                            game.setStatusBitOn(Game.READY_TO_START);
                            game.initGame();

                        } else {
                            client.sendEvent("error", "Room is full");
                            client.disconnect();
                        }
                    } else {
                        client.sendEvent("error", "Color is invalid");
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
                    if (Constants.DEBUG)
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

                    if (Constants.DEBUG)
                        log.info("Socket ID[{}] - token[{}] - username [{}]  Connected to server [mode: {}]",
                                client.getSessionId().toString(), token, username, gameType);

                    break;
                case Constants.GAME_TYPE_ONLINE: {
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    if (Constants.DEBUG)
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

            switch (gameType) {
                case Constants.GAME_TYPE_DARKBOARD:
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    Game dbgame = games.get(room);
                    dbgame.makeMove(data, username);
                    System.out.println("Move: " + data);
                    break;
                case Constants.GAME_TYPE_DEVELOPER:
                    token = params.get("token").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    room = token + username;
                    Game gamedev = games.get(room);
                    gamedev.makeMove(data, username);
                    System.out.println("Move: " + data);
                    break;
                case Constants.GAME_TYPE_ONLINE: {
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    if (Constants.DEBUG)
                        log.info("Socket ID[{}] - room[{}] - username [{}]  {}",
                                client.getSessionId().toString(), room, username, data);

                    Game game = games.get(room);
                    if (game.getStatusBit(Game.PLAYING) != 0)
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

                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    if (Constants.DEBUG)
                        log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through",
                                client.getSessionId().toString(), room, username);

                    client.leaveRoom(room);

                    Game dbgame = games.get(room);

                    if (dbgame == null) {
                        return;
                    }

                    if (dbgame.getStatusBit(Game.FINISHED) != 0) {
                        games.remove(room);
                    }

                    break;
                case Constants.GAME_TYPE_DEVELOPER:
                    token = params.get("token").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());
                    room = token + username;
                    client.leaveRoom(room);
                    if (Constants.DEBUG)
                        log.info("Socket ID[{}] - token[{}] - username [{}]  disconnected [mode: {}]",
                                client.getSessionId().toString(), token, username, gameType);

                    Game gamedev = games.get(room);

                    if (gamedev == null) {
                        return;
                    }

                    if (gamedev.status == Game.FINISHED) {
                        games.remove(room);
                    }
                    break;
                case Constants.GAME_TYPE_ONLINE:
                    room = params.get("room").stream().collect(Collectors.joining());
                    username = params.get("username").stream().collect(Collectors.joining());

                    if (Constants.DEBUG)
                        log.info("Socket ID[{}] - room[{}] - username [{}]  discnnected to chat module through",
                                client.getSessionId().toString(), room, username);
                    client.leaveRoom(room);

                    Game g = games.get(room);

                    if (g == null) {
                        return;
                    }
                    int pl = server.getRoomOperations(room).getClients().size();

                    if (pl == 0) {
                        g.stopTimers();
                        games.remove(room);
                        OnlineGame.deleteLobby(room);
                    }

                    if (g.getStatusBit(Game.FINISHED) != 0) {
                        g.stopTimers();
                        games.remove(room);
                    }

                    break;
                default:
                    break;
            }
        };
    }

    @Data
    @AllArgsConstructor
    public class TestResponse {
        public String message;
    }

    private int getNumOfPlayers() {
        return server.getAllClients().size();
    }

    @RequestMapping("/num")
    @CrossOrigin(origins = "http://localhost:3000")
    public TestResponse test() {
        return new TestResponse(Integer.toString(getNumOfPlayers()));
    }

    @RequestMapping("/rooms")
    @CrossOrigin(origins = "http://localhost:3000")
    public TestResponse getRooms() {
        return new TestResponse(server.getAllClients().toString());
    }

    @RequestMapping("/reset")
    @CrossOrigin(origins = "http://localhost:3000")
    public TestResponse reset() {
        games.clear();
        for (var client : server.getAllClients()) {
            client.disconnect();
        }
        return new TestResponse("Reset");
    }

}
