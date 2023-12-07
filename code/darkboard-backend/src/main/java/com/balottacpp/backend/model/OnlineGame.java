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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pgn.ExtendedPGNGame;
import umpire.local.ChessboardStateListener;
import umpire.local.LocalUmpire;
import umpire.local.StepwiseLocalUmpire;

import java.util.Arrays;
import java.util.ArrayList;

import java.util.Timer;
import java.util.TimerTask;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/*
dentro il loop di gioco mandare un evento "your turn"
    dentro tale evento ci mettiamo il timer così il client può aggiornarlo

dobbiamo quindi creare un timer che vada lato server, 
    lo possiamo mettere dentro la classe del socket player o del game
*/

public class OnlineGame extends Game {
    SocketPlayer whitePlayer;
    SocketPlayer blackPlayer;

    SocketIOClient whiteClient;
    SocketIOClient blackClient;

    String gameType;
    String room;

    StepwiseLocalUmpire umpire;

    CountdownTimer whiteTimer, blackTimer;

    ChessboardSocket whiteChessBoardListener, blackChessBoardListener;
    UmpireText whiteUmpireText, blackUmpireText;

    public OnlineGame(String gameType, String room) {
        this.gameType = gameType;
        this.room = room;
    }

    public String getUsername(String pl) {
        if (pl.equals("white"))
            return whitePlayer.playerName;
        else if (pl.equals("black"))
            return blackPlayer.playerName;
        else
            return null;
    }

    @Override
    public void whiteConnected(SocketIOClient whiteClient, String username) {
        addConnectedPlayer();
        if (Constants.DEBUG)
            System.out.println("White connected: " + username);
        if (whiteClient == null)
            if (Constants.DEBUG)
                System.out.println("whiteClient is null");
        this.whiteClient = whiteClient;
        whitePlayer = new SocketPlayer(true, whiteClient);
        whitePlayer.playerName = username;
        whiteUmpireText = new UmpireText(whiteClient, null);
        whitePlayer.addPlayerListener(whiteUmpireText);

    }

    @Override
    public void blackConnected(SocketIOClient blackClient, String username) {
        addConnectedPlayer();
        this.blackClient = blackClient;
        blackPlayer = new SocketPlayer(false, blackClient);
        var params = blackClient.getHandshakeData().getUrlParams();
        String blackUsername = params.get("username").stream().collect(Collectors.joining());
        blackPlayer.playerName = blackUsername;
        blackUmpireText = new UmpireText(blackClient, null);
        blackPlayer.addPlayerListener(blackUmpireText);
    }

    public void initGame() {

        if (getConnectedPlayers() == 2) {

            umpire = new StepwiseLocalUmpire(whitePlayer, blackPlayer);

            whiteChessBoardListener = new ChessboardSocket(whiteClient);
            blackChessBoardListener = new ChessboardSocket(blackClient);
            umpire.addListener(whiteChessBoardListener);
            umpire.addListener(blackChessBoardListener);

            umpire.stepwiseInit(null, null);

            whiteClient.sendEvent("opponent_connected", blackPlayer.playerName);
            blackClient.sendEvent("opponent_connected", whitePlayer.playerName);

            if (Constants.DEBUG)
                System.out.println("Game ready to start: " + whitePlayer.playerName + " vs " + blackPlayer.playerName);
            this.status = setStatusBitOn(PLAYING);
            this.startGame();
        } else {
            String error = "Not enough players to start the game";
            if ((getStatusBit(WAITING_FOR_BLACK & WAITING_FOR_WHITE) | WAITING_FOR_BLACK | WAITING_FOR_WHITE) > 0) {
                error += "\nOne of the players disconnected";
                if (Constants.DEBUG)
                    System.out.println(error);
                if (whiteClient != null)
                    whiteClient.sendEvent("error", error);
                if (blackClient != null)
                    blackClient.sendEvent("error", error);
            } else {
                setStatusBitOn(ABORTED);
                error += "\nGame aborted";
                if (Constants.DEBUG)
                    System.out.println(error);

                if (whiteClient != null)
                    whiteClient.sendEvent("error", error);
                if (blackClient != null)
                    blackClient.sendEvent("error", error);
            }
        }



    }

    @Data
    @AllArgsConstructor
    public class ReconnectionData {
        String fen;
        ArrayList<String> messages;
    }

    public void handleReconnect(SocketIOClient client, String username) {
        if (whitePlayer.playerName.equals(username)) {
            ArrayList<String> messages = whiteUmpireText.messages;
            whiteClient = client;
            whitePlayer.client = client;
            whiteUmpireText.client = client;
            whiteChessBoardListener.client = client;

            whiteClient.sendEvent("opponent_connected", blackPlayer.playerName);
            whiteClient.sendEvent("reconnection",
                    new ReconnectionData(umpire.toFen(), messages));
            whiteClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
        } else if (blackPlayer.playerName.equals(username)) {
            ArrayList<String> messages = blackUmpireText.messages;

            blackClient = client;
            blackUmpireText.client = client;
            blackPlayer.client = client;
            blackChessBoardListener.client = client;

            blackClient.sendEvent("opponent_connected", whitePlayer.playerName);
            blackClient.sendEvent("reconnection",
                    new ReconnectionData(umpire.toFen(), messages));
            blackClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
        }
    }

    SocketPlayer getPlayer(String username) {
        if (whitePlayer.playerName.equals(username))
            return whitePlayer;
        else if (blackPlayer.playerName.equals(username))
            return blackPlayer;
        else
            return null;
    }

    CountdownTimer getTimer(String username) {
        if (whitePlayer.playerName.equals(username))
            return whiteTimer;
        else if (blackPlayer.playerName.equals(username))
            return blackTimer;
        else
            return null;
    }

    public void stopTimers() {
        if (whiteTimer != null)
            whiteTimer.stop();
        if (blackTimer != null)
            blackTimer.stop();

    }

    @Data
    @AllArgsConstructor
    public class TimeInfo extends Object {
        int whiteTime;
        int blackTime;
    }

    public void startGame() {
        if (Constants.DEBUG)
            System.out.println("Starting game");

        whiteTimer = new CountdownTimer(600, () -> {
            if (Constants.DEBUG)
                System.out.println("White timer finished");
            umpire.resign(whitePlayer);
        });
        blackTimer = new CountdownTimer(600, () -> {
            if (Constants.DEBUG)
                System.out.println("Black timer finished");
            umpire.resign(blackPlayer);
        });

        Timer updater = new Timer();

        updater.scheduleAtFixedRate(new TimerTask() {
            public void run() {
                whiteClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
                blackClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
            }
        }, 0, 15 * 1000);

        while (umpire.getGameOutcome() == LocalUmpire.NO_OUTCOME) {
            Player p = umpire.turn();
            CountdownTimer t = getTimer(p.playerName);
            t.resume();
            Move m = p.getNextMove();
            umpire.stepwiseArbitrate(m);
            t.stop();
            if (Constants.DEBUG)
                System.out.println(
                        "Remaining time for " + p.playerName + ": " + t.getTime() / 60 + ":" + t.getTime() % 60);
            whiteClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
            blackClient.sendEvent("remaining_time", new TimeInfo(whiteTimer.getTime(), blackTimer.getTime()));
        }
        updater.cancel();
        // if (Constants.DEBUG)
        System.out.println("Game Over!");
        this.status = setStatusBitOn(FINISHED);

        /* save game */
        System.out.println("Saving game to databsase...");
        try {
            URL url = new URL("http://localhost:3000/api/games/lobby");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("PUT");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "text/plain");

            try (OutputStream os = con.getOutputStream()) {
                String jsonInputString = umpire.transcript.toString();
                byte[] body = jsonInputString.getBytes("utf-8");
                os.write(body, 0, body.length);
            }

            int code = con.getResponseCode();
            // if (Constants.DEBUG) {
            if (code == 200) {
                System.out.println("Game saved");
            } else {
                System.out.println("Error saving game");
            }
            // }

        } catch (Exception e) {
            if (Constants.DEBUG)
                System.out.println("Error deleting lobby");
        }

        deleteLobby(room);
    }

    static public void deleteLobby(String room) {
        if (Constants.DEBUG)
            System.out.println("Deleting lobby " + room + "...");
        try {
            URL url = new URL("http://localhost:3000/api/games/lobby");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("DELETE");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "application/json");

            try (OutputStream os = con.getOutputStream()) {
                String jsonInputString = "{\"room\": \"" + room + "\"}";
                byte[] body = jsonInputString.getBytes("utf-8");
                os.write(body, 0, body.length);
            }

            int code = con.getResponseCode();
            if (Constants.DEBUG) {
                if (code == 200) {
                    System.out.println("Lobby deleted");
                } else {
                    System.out.println("Error deleting lobby");
                }
            }

        } catch (Exception e) {
            if (Constants.DEBUG)
                System.out.println("Error deleting lobby");
        }
    }

    public void makeMove(String move, String username) {
        // build move
        if (Constants.DEBUG)
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

        whitePlayer.provideMove(new Move());
        blackPlayer.provideMove(new Move());
    }

    public interface TimerCallback {
        public void onTimerFinished();
    }

    public class CountdownTimer {

        private Timer timer;
        private int seconds;
        private boolean isRunning;
        private TimerCallback callback;

        public CountdownTimer(int seconds, TimerCallback callback) {
            this.seconds = seconds;
            this.timer = new Timer();
            this.callback = callback;
        }

        public int getTime() {
            return seconds;
        }

        public void start() {
            if (isRunning) {
                return;
            }

            isRunning = true;
            timer.scheduleAtFixedRate(new TimerTask() {
                public void run() {
                    if (seconds > 0) {
                        seconds--;
                    } else {
                        if (Constants.DEBUG)
                            System.out.println("Timer finished!");
                        callback.onTimerFinished();
                        stop();
                    }
                }
            }, 0, 1000);
        }

        public void stop() {
            timer.cancel();
            timer = new Timer();
            isRunning = false;
        }

        public void resume() {
            if (!isRunning) {
                start();
            }
        }
    }

    class SocketPlayer extends HumanPlayer {
        public SocketIOClient client;

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

        public void updateClient(SocketIOClient client) {
            this.client = client;
        }
    }

    public class UmpireText implements PlayerListener {

        ArrayList<String> messages = new ArrayList<String>();
        SocketIOClient client;

        boolean finished = false;

        public UmpireText(SocketIOClient client, ArrayList<String> messages) {
            this.client = client;
            if (messages != null) {
                this.messages = messages;
            }
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
            messages.add(s);
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
            if (Constants.DEBUG)
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
