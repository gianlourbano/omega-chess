package com.balottacpp.backend.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import ai.player.HumanPlayer;
import core.Chessboard;
import core.Move;
import lombok.Data;

public class SocketPlayer extends HumanPlayer {
    Move nextMove = null;
	int setPromotionPiece = Chessboard.QUEEN;
    boolean hasTurn;
    
    public SocketPlayer(boolean white) {
        super(white);
    }

    @Override
    public synchronized void provideMove(Move m) {
        System.out.println("provideMove called");
        if (!hasTurn) return;
        nextMove = m;
        System.out.println("Move provided: " + m.toString());
        if (m.piece==Chessboard.PAWN && (m.toY==0 || m.toY==7)) m.promotionPiece = (byte)setPromotionPiece;
        notifyAll();
    }
}
