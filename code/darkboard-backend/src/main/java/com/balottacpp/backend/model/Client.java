package com.balottacpp.backend.model;

import com.corundumstudio.socketio.SocketIOClient;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
public class Client {
    public String username;
    public String room;
    public String gameType;
    public String token;
    
    public SocketIOClient client;
}
