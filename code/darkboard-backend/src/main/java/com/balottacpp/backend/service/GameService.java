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

    public void startGame(String room, SocketIOClient client) {

        DarkboardGame game = new DarkboardGame(room, client);
        games.put(room, game);
        game.startGame();
    }

    public void endGame(String room) {
        games.remove(room);
    }

    public void makeMove(String room, String move) {
        DarkboardGame game = games.get(room);
        game.makeMove(move);
    }

    public int getNumberOfGames() {
        return games.size();
    }

    public void printGameInfo() {
        System.out.println("Number of games: " + games.size());
        for (String key : games.keySet()) {
            System.out.println("Room: " + key);
        }
    }
}
