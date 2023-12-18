package com.balottacpp.backend.model;

import com.corundumstudio.socketio.SocketIOClient;
import com.balottacpp.backend.constants.Constants;

public class Game {

    public static final int CREATING = 1;
    public static final int WAITING_FOR_WHITE = 1 << 1;
    public static final int WAITING_FOR_BLACK = 1 << 2;
    public static final int READY_TO_START = 1 << 3;
    public static final int PLAYING = 1 << 4;
    public static final int FINISHED = 1 << 5;
    public static final int ABORTED = 1 << 6;
    public static final int CONNECTED = (1 << 7) | (1 << 8);

    public int status = CREATING;

    public int setStatusBitOn(int bit) {
        status |= bit;
         if (Constants.DEBUG) System.out.println("Status: " + Integer.toBinaryString(status) + ", Bit on: " + Integer.toBinaryString(bit));
        return status;
    }

    public int setStatusBitOff(int bit) {
        status &= ~bit;
        if (Constants.DEBUG) System.out.println("Status: " + Integer.toBinaryString(status) + ", Bit off: " + Integer.toBinaryString(bit));
        return status;
    }

    public int getStatusBit(int bit) {
        if (Constants.DEBUG) System.out.println("Status: " + Integer.toBinaryString(status) + ", Bit: " + Integer.toBinaryString(bit));
        return (status & bit) >> (int)(Math.log(bit) / Math.log(2));
    }

    public int addConnectedPlayer() {
        int conns = status & CONNECTED >> 7;
        status |= ((conns + 1) << 7);
        if (Constants.DEBUG) System.out.println("Status connections +1 (conns: " + conns + ", status: " + status + ")");
        return status;
    }

    public int removeConnectedPlayer() {
        if (Constants.DEBUG) System.out.println("Status connections -1");
        int conns = status & CONNECTED;
        status &= (conns - (1<<7));
        return status;
    }

    public int getConnectedPlayers() {
        if (Constants.DEBUG) System.out.println("Status connections: " + ((status & CONNECTED) >> 7));
        return (status & CONNECTED) >> 7;
    }

    public void makeMove(String move, String username) {
         // must be implemented by subclass
    }

    public void resignGame(String username) {
         // must be implemented by subclass
    }

    public void startGame() {
         // must be implemented by subclass
    }

    public void initGame() {
         // must be implemented by subclass
    }

    public void stopTimers() {
      // must be implemented by subclass
    }

    public void whiteConnected(SocketIOClient whiteClient, String username) {
         // must be implemented by subclass
    }

    public void blackConnected(SocketIOClient blackClient, String username) {
         // must be implemented by subclass
    }

    public void handleReconnect(SocketIOClient client, String username) {
         // must be implemented by subclass
    }

    public String getUsername(String pl) {
        return null;
    }
}