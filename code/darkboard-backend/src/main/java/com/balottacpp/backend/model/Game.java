package com.balottacpp.backend.model;

import com.corundumstudio.socketio.SocketIOClient;

public class Game {
    public void makeMove(String move, String username) {
    };

    public void resignGame(String username) {
    };

    public void startGame() {
    };

    public void whiteConnected(SocketIOClient whiteClient, String username) {
    };

    public void blackConnected(SocketIOClient blackClient, String username) {
    };
} 