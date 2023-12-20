package com.balottacpp.backend.model;

import java.util.stream.Collectors;

import javax.swing.JOptionPane;

import com.corundumstudio.socketio.SocketIOClient;

import ai.opponent.OpponentProfile;
import ai.player.Darkboard;
import ai.player.DeepDarkboard101;
import ai.player.HumanPlayer;
import ai.player.Player;
import ai.player.PlayerListener;
import core.Chessboard;
import core.Move;
import pgn.ExtendedPGNGame;
import umpire.local.ChessboardStateListener;
import umpire.local.LocalUmpire;
import umpire.local.StepwiseLocalUmpire;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class DeveloperGame extends Game {

    SocketIOClient botClient;
    SocketPlayer bot;
    StepwiseLocalUmpire umpire;

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

    public DeveloperGame(SocketIOClient bot) {
        this.botClient = bot;
        this.bot = new SocketPlayer(true, bot);

        var params = bot.getHandshakeData().getUrlParams();
        String botname = params.get("username").stream().collect(Collectors.joining());
        this.bot.playerName = botname;
        this.bot.addPlayerListener(new UmpireText(bot));

        OpponentProfile op = OpponentProfile.getProfile("rjay");
        Player p2 = new DeepDarkboard101(false, op.openingBookWhite, op.openingBookBlack, "rjay");
        p2.playerName = "Darkboard";
        this.umpire = new StepwiseLocalUmpire(this.bot, p2);
        this.umpire.addListener(new ChessboardSocket(bot));
        this.umpire.stepwiseInit(null, null);
    }

    public void makeMove(String move, String username) {
        System.out.println("Move: " + move);

        Move m = umpire.parseString(move, true);

        umpire.isLegalMove(m, umpire.turn);

        this.bot.provideMove(m);
    }

    public void resignGame(String username) {
        umpire.resign(bot);
    }

    public void startGame() {
        System.out.println("Starting game");
        //this.status = STARTED;
        while (umpire.getGameOutcome() == LocalUmpire.NO_OUTCOME) {
            Player p = umpire.turn();
            // f.interrogatePlayer(t==0);
            Move m = p.getNextMove();
            umpire.stepwiseArbitrate(m);
        }
        System.out.println("Game Over!");

        try {
                        /* save game */
            System.out.println("Saving game to databsase...");
            
            URL url = new URL("http://chess:3000/api/games/lobby");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("PUT");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "text/plain");
            System.out.println("Game: " + umpire.transcript.toString());

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

        } catch (Exception e) {

            System.out.println("Error saving game");
            
        }

        // client.sendEvent("game_over", umpire.transcript.toString());
        System.out.println("Game: " + umpire.transcript.toString());
        this.status = FINISHED;
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
