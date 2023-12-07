package com.balottacpp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.balottacpp.backend.constants.Constants;
import com.balottacpp.backend.socket.SocketModule;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOServer;

import ai.player.Darkboard;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        String path = System.getProperty("user.home") + "/darkboard_data/";
        if(Constants.DEBUG) System.out.println(path);
        Darkboard.initialize(path);
        
        SpringApplication.run(BackendApplication.class, args);
    }

}
