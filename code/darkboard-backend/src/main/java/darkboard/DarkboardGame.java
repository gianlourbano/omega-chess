package darkboard;

import ai.opponent.OpponentProfile;
import ai.player.Darkboard;
import ai.player.DeepDarkboard101;
import ai.player.HumanPlayer;
import pgn.ExtendedPGNGame;
import umpire.local.LocalUmpire;

public class DarkboardGame {


    public static void main(String args[]) {
        String path = System.getProperty("user.home") + "/darkboard_data/";
			System.out.println(path);
			Darkboard.initialize(path);

        OpponentProfile op = OpponentProfile.getProfile("rjay");

        LocalUmpire umpire = new LocalUmpire(new DeepDarkboard101(true,op.openingBookWhite,op.openingBookBlack,"rjay"), new DeepDarkboard101(false,op.openingBookWhite,op.openingBookBlack,"rjay"));

        ExtendedPGNGame game = umpire.arbitrate();

        System.out.println(game);
    }
}
