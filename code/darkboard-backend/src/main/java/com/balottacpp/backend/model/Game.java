package com.balottacpp.backend.model;

import com.corundumstudio.socketio.SocketIOClient;

public class Game {

    public enum GameStatus {
        NOT_YET_INITIALIZED, STARTED, FINISHED, WAITING_FOR_BLACK
    }

    public GameStatus status = GameStatus.NOT_YET_INITIALIZED;

    public void makeMove(String move, String username) {
    };

    public void resignGame(String username) {
    };

    public void startGame() {
    };

    public void stopTimers() {
    };

    public void whiteConnected(SocketIOClient whiteClient, String username) {
    };

    public void blackConnected(SocketIOClient blackClient, String username) {
    };

    public void handleReconnect(SocketIOClient client, String username) {
    }

    public String getUsername(String pl) {
        return null;
    }
}