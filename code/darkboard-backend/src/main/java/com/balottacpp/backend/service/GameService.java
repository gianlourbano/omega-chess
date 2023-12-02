package com.balottacpp.backend.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.balottacpp.backend.model.DarkboardGame;
import com.corundumstudio.socketio.SocketIOClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
    private final HashMap<String, DarkboardGame> games = new HashMap<>();

    public void startGame(String room, String whitePlayer, String blackPlayer, SocketIOClient client) {

        DarkboardGame game = new DarkboardGame(room, whitePlayer, blackPlayer, client);
        games.put(room, game);
        game.startGame();
    }

    public void endGame(String room) {
        games.remove(room);
    }

    public void makeMove(String room, String move) {
        DarkboardGame game = games.get(room);
        game.makeMove(move, null);
    }

    public int getNumberOfGames() {
        return games.size();
    }

    public void resignGame(String room) {
        DarkboardGame game = games.get(room);
        game.resignGame(null);
    }

    public void printGameInfo() {
        System.out.println("Number of games: " + games.size());
        for (String key : games.keySet()) {
            System.out.println("Room: " + key);
        }
    }
}
