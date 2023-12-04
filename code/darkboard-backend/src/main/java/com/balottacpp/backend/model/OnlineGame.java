package com.balottacpp.backend.model;

import java.util.stream.Collectors;

import javax.swing.JOptionPane;

import com.balottacpp.backend.constants.Constants;
import com.corundumstudio.socketio.SocketIOClient;

import ai.player.Darkboard;
import ai.player.HumanPlayer;
import ai.player.Player;
import ai.player.PlayerListener;
import core.Chessboard;
import core.Move;
import pgn.ExtendedPGNGame;
import umpire.local.ChessboardStateListener;
import umpire.local.LocalUmpire;
import umpire.local.StepwiseLocalUmpire;

public class OnlineGame extends Game {
    SocketPlayer whitePlayer;
    SocketPlayer blackPlayer;

    SocketIOClient whiteClient;
    SocketIOClient blackClient;

    String gameType;

    StepwiseLocalUmpire umpire;

    public OnlineGame(String gameType) {
        this.gameType = gameType;
    }

    @Override
    public void whiteConnected(SocketIOClient whiteClient, String username) {
        /** TODO: move this out of here */
        String path = System.getProperty("user.home") + "/darkboard_data/";
		System.out.println(path);
		Darkboard.initialize(path);

        System.out.println("White connected: " + username);
        if(whiteClient == null) System.out.println("whiteClient is null");
        this.whiteClient = whiteClient;
        whitePlayer = new SocketPlayer(true, whiteClient);
        whitePlayer.playerName = username;
        whitePlayer.addPlayerListener(new UmpireText(whiteClient));
    }

    @Override
    public void blackConnected(SocketIOClient blackClient, String username) {
        this.blackClient = blackClient;
        blackPlayer = new SocketPlayer(false, blackClient);
        var params = blackClient.getHandshakeData().getUrlParams();
        String blackUsername = params.get("username").stream().collect(Collectors.joining());
        blackPlayer.playerName = blackUsername;
        blackPlayer.addPlayerListener(new UmpireText(blackClient));

        /* since black player is the last to connect,
           inform both players that they have an apponent */
        blackClient.sendEvent("opponent_connected", whitePlayer.playerName);
        whiteClient.sendEvent("opponent_connected", blackPlayer.playerName);

        /* initialize umpire */
        umpire = new StepwiseLocalUmpire(whitePlayer, blackPlayer);
        umpire.addListener(new ChessboardSocket(whiteClient));
        umpire.addListener(new ChessboardSocket(blackClient));

        umpire.stepwiseInit(null, null);

        System.out.println("Game ready to start: " + whitePlayer.playerName + " vs " + blackPlayer.playerName);
        this.startGame();
        this.status = GameStatus.STARTED;
    }

    /*
     * game starts after both players are ready
     */
    public OnlineGame(String gameType, SocketIOClient whiteClient, SocketIOClient blackClient) {
        this.gameType = gameType;
        this.whiteClient = whiteClient;
        this.blackClient = blackClient;

        /* set players' parameters */
        whitePlayer = new SocketPlayer(true, whiteClient);
        blackPlayer = new SocketPlayer(false, blackClient);

        var params = whiteClient.getHandshakeData().getUrlParams();
        String whiteUsername = params.get("username").stream().collect(Collectors.joining());

        params = blackClient.getHandshakeData().getUrlParams();
        String blackUsername = params.get("username").stream().collect(Collectors.joining());

        whitePlayer.playerName = whiteUsername;
        blackPlayer.playerName = blackUsername;

        /* set umpire */
        umpire = new StepwiseLocalUmpire(whitePlayer, blackPlayer);

        whitePlayer.addPlayerListener(new UmpireText(whiteClient));
        blackPlayer.addPlayerListener(new UmpireText(blackClient));

        umpire.addListener(new ChessboardSocket(whiteClient));
        umpire.addListener(new ChessboardSocket(blackClient));

        umpire.stepwiseInit(null, null);

        System.out.println("Game ready to start: " + whitePlayer.playerName + " vs " + blackPlayer.playerName);
        whiteClient.sendEvent("game_started");

    }

    public void startGame() {
        System.out.println("Starting game");
        while (umpire.getGameOutcome() == LocalUmpire.NO_OUTCOME) {
            Player p = umpire.turn();
            // f.interrogatePlayer(t==0);
            Move m = p.getNextMove();
            umpire.stepwiseArbitrate(m);
        }
        System.out.println("Game Over!");
        this.status = GameStatus.FINISHED;
    }

    public void makeMove(String move, String username) {
        // build move
        System.out.println("Move: " + move);

        boolean isWhite = username.equals(whitePlayer.playerName) ? true : false;

        Move m = umpire.parseString(move, isWhite);

        // boolean res = umpire.isLegalMove(m, umpire.turn);

        if (username.equals(whitePlayer.playerName)) {
            whitePlayer.provideMove(m);
        } else if (username.equals(blackPlayer.playerName)) {
            blackPlayer.provideMove(m);
        }
    }

    public void resignGame(String username) {
        if (username.equals(whitePlayer.playerName)) {
            umpire.resign(whitePlayer);
        } else if (username.equals(blackPlayer.playerName)) {
            umpire.resign(blackPlayer);
        }
    }

    class SocketPlayer extends HumanPlayer {
        SocketIOClient client;

        public SocketPlayer(boolean isWhite, SocketIOClient client) {
            super(isWhite);
            this.client = client;
        }

        public void receiveAftermath(ExtendedPGNGame game) {
            client.sendEvent("game_over", game.toString());
        }
    }

    public class ChessboardSocket implements ChessboardStateListener {
        SocketIOClient client;

        public ChessboardSocket(SocketIOClient client) {
            this.client = client;
        }

        public void chessboardStateChanged() {
            client.sendEvent("chessboard_changed", umpire.toFen());
        }
    }

    public class UmpireText implements PlayerListener {
        SocketIOClient client;

        boolean finished = false;

        public UmpireText(SocketIOClient client) {
            this.client = client;
        }

        public int currentMove() {
            return (umpire.transcript.getMoveNumber());
        }

        public String playerColor(Player p) {
            return (p.isWhite ? "White's turn" : "Black's turn");
        }

        public String opponentColor(Player p) {
            return (!p.isWhite ? "White's turn" : "Black's turn");
        }

        public String checkString(int check) {
            switch (check) {
                case Chessboard.CHECK_FILE:
                    return "File; ";
                case Chessboard.CHECK_RANK:
                    return "Rank; ";
                case Chessboard.CHECK_SHORT_DIAGONAL:
                    return "Short D; ";
                case Chessboard.CHECK_LONG_DIAGONAL:
                    return "Long D; ";
                case Chessboard.CHECK_KNIGHT:
                    return "Knight; ";
            }
            return "";
        }

        public String triesString(int tries) {
            return "" + tries + (tries != 1 ? " Tries; " : " Try; ");
        }

        public void preAppend(String s) {
            // setText(s+"\n"+getText());
            client.sendEvent("read_message", s);
        }

        public void communicateIllegalMove(Player p, Move m) {
            String s = m.toString();
            preAppend("Illegal move: " + s);
        }

        public void communicateLegalMove(Player p, int capture, int oppTries, int oppCheck, int oppCheck2) {
            if (!p.isHuman() || finished)
                return;
            String s = (currentMove() + (p.isWhite ? 0 : 1)) + ". " + opponentColor(p) + "; ";
            if (capture != Chessboard.NO_CAPTURE) {
                if (capture == Chessboard.CAPTURE_PAWN)
                    s += "Pawn x";
                else
                    s += "Piece x";
                s += Move.squareString(p.lastMove.toX, p.lastMove.toY) + "; ";
            }
            if (oppTries > 0) {
                s += triesString(oppTries);
            }
            s += checkString(oppCheck);
            s += checkString(oppCheck2);
            preAppend(s);
        }

        public void communicateOutcome(Player p, int outcome) {
            System.out.println("Outcome: " + outcome);
            if (!p.isHuman() || finished)
                return;
            String s = (p.isWhite ? "White" : "Black");
            String t = (!p.isWhite ? "White" : "Black");
            switch (outcome) {
                case Player.PARAM_CHECKMATE_DEFEAT:
                    preAppend(s + " checkmated");
                    break;
                case Player.PARAM_CHECKMATE_VICTORY:
                    preAppend(t + " checkmated");
                    break;
                case Player.PARAM_RESIGN_DEFEAT:
                    preAppend(s + " resigned");
                    break;
                case Player.PARAM_RESIGN_VICTORY:
                    preAppend(t + " resigned");
                    break;
                case Player.PARAM_NO_MATERIAL:
                    preAppend("Insufficient Material Draw");
                    break;
                case Player.PARAM_STALEMATE_DRAW:
                    preAppend("Stalemate");
                    break;
                case Player.PARAM_AGREED_DRAW:
                    preAppend("Mutual agreement draw");
                    break;
                case Player.PARAM_50_DRAW:
                    preAppend("Fifty moves draw");
                    break;
            }
            finished = true;
        }

        public void communicateUmpireMessage(Player p, int capX, int capY, int tries, int check, int check2) {
            if (!p.isHuman() || finished)
                return;
            String s = (currentMove() + (p.isWhite ? 1 : 0)) + ". " + playerColor(p) + "; ";

            int capture = 0;
            if (capX < 0)
                capture = Chessboard.NO_CAPTURE;
            else {
                int x = p.simplifiedBoard.getFriendlyPiece(capX, capY);
                if (x == Chessboard.PAWN)
                    capture = Chessboard.CAPTURE_PAWN;
                else
                    capture = Chessboard.CAPTURE_PIECE;
            }
            if (capture != Chessboard.NO_CAPTURE) {
                if (capture == Chessboard.CAPTURE_PAWN)
                    s += "Pawn x";
                else
                    s += "Piece x";
                s += Move.squareString(capX, capY) + "; ";
            }
            if (tries > 0) {
                s += triesString(tries);
            }
            s += checkString(check);
            s += checkString(check2);
            preAppend(s);
        }

        public void updateTime(Player p, long newQty) {
            // TODO Auto-generated method stub

        }

        public void communicateInfo(Player p, int code, int parameter) {
            // TODO Auto-generated method stub

            switch (code) {
                case Player.INFO_DRAW_OFFER_REJECTED:
                    JOptionPane.showMessageDialog(null, "Draw offer was rejected.", "Umpire message",
                            JOptionPane.INFORMATION_MESSAGE);
            }

        }

        public void communicateObject(Player p, Object tag, Object value, int messageType) {
            // TODO Auto-generated method stub

        }

        public boolean isInterestedInObject(Player p, Object tag, int messageType) {
            // TODO Auto-generated method stub
            return false;
        }
    }

}
