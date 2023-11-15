package com.balottacpp.backend.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.balottacpp.backend.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {

    private final GameService gameService;

    // public void sendSocketMessage(SocketIOClient senderClient, Message message, String room) {
    //     for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
    //         if (!client.getSessionId().equals(senderClient.getSessionId())) {
    //             client.sendEvent("read_message",
    //                     message);
    //         }
    //     }
    // }

    public boolean makeMove(SocketIOClient senderClient, String room, String move) {
        return gameService.makeMove(room, move);
    }

    public void createNewGame(SocketIOClient senderClient, String room) {
        gameService.startGame(room, senderClient);
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("read_message",
                        "New game started!");
            }
        }
    }

    public void endGame(SocketIOClient senderClient, String room) {
        gameService.endGame(room);
        for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("read_message",
                        "Game ended!");
            }
        }
    }

    public int getNumberOfGames() {
        return gameService.getNumberOfGames();
    }

    public void printGameInfo() {
        gameService.printGameInfo();
    }
}
