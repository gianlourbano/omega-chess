/**
 * @jest-environment node
*/

import { POST, DELETE, PUT } from './route';

import User from "@/db/models/User";
import Game from "@/db/models/Game";
import mongoDriver from "@/db/mongoDriver";

jest.mock('@/db/models/GameLobby', () => {
    return jest.fn().mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue({_id: 'mockId'}),
        findByIdAndDelete: jest.fn().mockResolvedValue(null)
      };
    });
});
import GameLobby from '@/db/models/GameLobby';

import { parse } from "pgn-parser";
import { getUpdatedRatings } from "@/utils/ELO/EloRating";

jest.mock("@/db/models/User");
//jest.mock("@/db/models/GameLobby");
jest.mock("@/db/models/Game");
jest.mock("@/db/mongoDriver");


  
 

describe('POST api/games/lobby', () => {
    beforeEach(() => {
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });

  it('should create a new game lobby and return the lobby details', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ gameType: 'darkboard', player: 'John' }),
    } as unknown as Request;

    const response = await POST(req);

    (GameLobby.findOne as jest.Mock).mockResolvedValue(null);

    const res = await response.json();

    expect(res).toEqual({
      id: expect.any(String),
      whitePlayer: 'John',
      blackPlayer: "darkboard",
    });
  });

  it('should return an existing game lobby if the player is already in a lobby', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ gameType: 'darkboard', player: 'John' }),
    } as unknown as Request;

    const existingGame = {
      _id: 'existingId',
      whitePlayer: 'John',
      blackPlayer: null,
    };

    (GameLobby.findOne as jest.Mock).mockResolvedValue({
        id: 'existingId',
        whitePlayer: 'John',
        blackPlayer: null,
      });

    const response = await POST(req);
    const res = await response.json();


    expect(res).toEqual({
      id: 'existingId',
      whitePlayer: 'John',
      blackPlayer: null,
    });
  });
});


describe('DELETE api/games/lobby', () => {
    beforeEach(() => {
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });

  it('should delete an existing game lobby', async () => {
    const mockRequest: Request = {
        json: jest.fn().mockResolvedValueOnce({room: "existingLobby"}),
    } as unknown as Request;

    const response = await DELETE(mockRequest);

    //(GameLobby.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
    
    expect(response.json()).toBe("OK");
  });
});

/*


*/


describe('PUT api/games/lobby', () => {
    beforeEach(() => {
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });

  it('should store game data', async () => {
    const pgnGame = `
                [Event "ICC w16"]
                [Site ""]
                [Date "2023.12.19"]
                [Round "1"]
                [White "liam"]
                [Black "Darkboard"]
                [Result "1/2-1/2"]
                [Variant ""]
                [Time "21:00:09"]

                1.   f4 {(:)}
                    a5 {(:)}
                2.   d4 {(:)}
                    c6 {(:)}
                3.   e4 {(:)}
                    Ra6 {(:)}
                4.   e5 {(:)}
                    h6 {(:)}
                5.   Qe2 {(:)}
                    e6 {(:)}
                6.   h4 {(:)}
                    Ne7 {(:)}
                7.   g3 {(:)}
                    Rg8 {(:)}
                8.   Nh3 {(:)}
                    b6 {(:)}
                9.   Nf2 {(:)}
                    g6 {(:)}
                10.   Ne4 {(:)}
                    d6 {(P1:)}
                11.   exd6 {(Xd6:)}
                    Qxd6 {(Xd6:)}
                12.   Nxd6+ {(Xd6,CN:)}
                    Kd7 {(:f6,Bg7,Rg7)}
                13.   Ne4 {(:)}
                    Bb7 {(:)}
                14.   c3 {(:)}
                    Nc8 {(:)}
                15.   b4 {(P1:)}
                    axb4 {(Xb4,P1:)}
                16.   cxb4 {(Xb4:)}
                    Bxb4+ {(Xb4,CL:)}
                17.   Bd2 {(:)}
                    Re8 {(:)}
                18.   Bxb4 {(Xb4:)}
                    Ra5 {(:)}
                19.   a3 {(:)}
                    Na6 {(:)}
                20.   Ra2 {(:)}
                    Ra4 {(:)}
                21.   Rb2 {(:)}
                    Ne7 {(:)}
                22.   Nbd2 {(:)}
                    Bc8 {(:)}
                23.   Bg2 {(:)}
                    f5 {(:)}
                24.   Ng5 {(P1:)}
                    hxg5 {(Xg5,P2:bxa5,bxc5,cxb5,cxd5,exd5,fxe4,fxg4,gxh5)}
                25.   hxg5 {(Xg5:)}
                    Nd5 {(:)}
                26.   Bxd5 {(Xd5,P2:)}
                    cxd5 {(Xd5:bxa5,bxc5,cxb5)}
                27.   Rc2 {(:)}
                    Nc7 {(:)}
                28.   Rc5 {(P1:)}
                    bxc5 {(Xc5,P1:bxa5)}
                29.   Bxc5 {(Xc5:)}
                    Ba6 {(:)}
                30.   Bb4 {(:)}
                    Bc4 {(:)}
                31.   Nb1 {(:)}
                    Rea8 {(:)}
                32.   Nc3 {(:)}
                    Ba2 {(:)}
                33.   Nxa4 {(Xa4:)}
                    Rxa4 {(Xa4:)}
                34.   Qc2 {(:)}
                    Ra6 {(:)}
                35.   Qa4+ {(CS:)}
                    Nb5 {(:Ke8,Kc6,Ne8)}
                36.   Qb3 {(:)}
                    Na7 {(:)}
                37.   a4 {(:)}
                    Rc6 {(:)}
                38.   Qa3 {(:)}
                    Rc7 {(:)}
                39.   a5 {(:)}
                    Bc4 {(:)}
                40.   Bc5 {(:)}
                    Kc6 {(:)}
                41.   a6 {(:)}
                    Nc8 {(:)}
                42.   a7 {(:)}
                    Ne7 {(:)}
                43.   a8=Q+ {(CL:)}
                    Rb7 {(:Kb7)}
                44.   Qa2 {(:)}
                    Bxa2 {(Xa2:Rc7,Ra7,Rb8,Rd7)}
                45.   Ke2 {(:)}
                    Kc7 {(:Rc7,Ra7,Rb1,Rb8,Rb2,Kc5)}
                46.   Ra1 {(:)}
                    Nc6 {(:)}
                47.   Rxa2 {(Xa2:)}
                    Rb8 {(:)}
                48.   Kf3 {(:)}
                    Kc8 {(:)}
                49.   Bf8 {(:)}
                    Kc7 {(:d4)}
                50.   Be7 {(:)}
                    Kc8 {(:)}
                51.   Bd8 {(:)}
                    Kxd8 {(Xd8:d4,Kc7)}
                52.   Rd2 {(:)}
                    Ne7 {(:)}
                53.   Qxd5+ {(Xd5,CF,P1:)}
                    exd5 {(Xd5:)}
                54.   Re2 {(:)}
                    Rb1 {(:)}
                55.   Re5 {(:)}
                    Rd1 {(:)}
                56.   Rxd5+ {(Xd5,CF:)}
                    Nxd5 {(Xd5:)}
                57.   g4 {(P1:)}
                    fxg4+ {(Xg4,CS:fxe4)}
                58.   Kxg4 {(Xg4:)}
                    Ne7 {(:)}
                59.   f5 {(P1:)}
                    gxf5+ {(Xf5,CL:)}
                60.   Kh5 {(:)}
                    Rf1 {(:)}
                61.   g6 {(:)}
                    Re1 {(:)}
                62.   Kh6 {(:)}
                    Re3 {(:)}
                63.   Kh7 {(:)}
                    Re4 {(:)}
                64.   g7 {(:)}
                    f4 {(:)}
                65.   g8=Q+ {(CR:)}
                    Nxg8 {(Xg8:Ke8,Kc8)}
                66.   Kxg8 {(Xg8:)}
                    Re3 {(:)}
                67.   Kf7 {(:)}
                    f3 {(:)}
                68.   d5 {(:)}
                    f2 {(:)}
                69.   Kf6 {(:)}
                    f1=Q+ {(CF:)}
                70.   Kg6 {(:)}
                    Qh3 {(:)}
                71.   d6 {(:)}
                    Rg3+ {(CF:)}
                72.   Kf7 {(:)}
                    Qg4 {(:)}
                73.   d7 {(:)}
                    Rg2 {(:Ke7)}
                74.   Kf8 {(:)}
                    Qg6 {(:Ke7)}
                1/2-1/2
                `
    
    const mockRequest: Partial<Request> = {
      text: jest.fn().mockResolvedValueOnce(pgnGame),
    };

    const response = await PUT(mockRequest as Request);

    const mockUser1 = {
      scores: {
        wins: 0,
        losses: 0,
        draws: 0,
      },
      eloScore: 1000,
      games: [],
      save: jest.fn().mockResolvedValue(true),
    };
    const mockUser2 = {
      scores: {
        wins: 0,
        losses: 0,
        draws: 0,
      },
      eloScore: 1000,
      games: [],
      save: jest.fn().mockResolvedValue(true),
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser1);
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser2);

    const  mockGameData = {
        gamemode: "kriegspiel",
        whitePlayer: "whitePlayer",
        blackPlayer: "blackPlayer",
        pgn: "pgn",
        result: "result",
        save: jest.fn().mockResolvedValue(true)
    };
    (Game.create as jest.Mock).mockResolvedValueOnce(mockGameData);


    (mockUser1.games.push as jest.Mock).mockResolvedValueOnce(null);
    (mockUser2.games.push as jest.Mock).mockResolvedValueOnce(null);


    expect(response.status).toBe(200);
  });
});



/*
[Event "ICC w16"]
[Site ""]
[Date "2023.12.19"]
[Round "1"]
[White "liam"]
[Black "Darkboard"]
[Result "1/2-1/2"]
[Variant ""]
[Time "21:00:09"]

1.   f4 {(:)}
     a5 {(:)}
2.   d4 {(:)}
     c6 {(:)}
3.   e4 {(:)}
     Ra6 {(:)}
4.   e5 {(:)}
     h6 {(:)}
5.   Qe2 {(:)}
     e6 {(:)}
6.   h4 {(:)}
     Ne7 {(:)}
7.   g3 {(:)}
     Rg8 {(:)}
8.   Nh3 {(:)}
     b6 {(:)}
9.   Nf2 {(:)}
     g6 {(:)}
10.   Ne4 {(:)}
     d6 {(P1:)}
11.   exd6 {(Xd6:)}
     Qxd6 {(Xd6:)}
12.   Nxd6+ {(Xd6,CN:)}
     Kd7 {(:f6,Bg7,Rg7)}
13.   Ne4 {(:)}
     Bb7 {(:)}
14.   c3 {(:)}
     Nc8 {(:)}
15.   b4 {(P1:)}
     axb4 {(Xb4,P1:)}
16.   cxb4 {(Xb4:)}
     Bxb4+ {(Xb4,CL:)}
17.   Bd2 {(:)}
     Re8 {(:)}
18.   Bxb4 {(Xb4:)}
     Ra5 {(:)}
19.   a3 {(:)}
     Na6 {(:)}
20.   Ra2 {(:)}
     Ra4 {(:)}
21.   Rb2 {(:)}
     Ne7 {(:)}
22.   Nbd2 {(:)}
     Bc8 {(:)}
23.   Bg2 {(:)}
     f5 {(:)}
24.   Ng5 {(P1:)}
     hxg5 {(Xg5,P2:bxa5,bxc5,cxb5,cxd5,exd5,fxe4,fxg4,gxh5)}
25.   hxg5 {(Xg5:)}
     Nd5 {(:)}
26.   Bxd5 {(Xd5,P2:)}
     cxd5 {(Xd5:bxa5,bxc5,cxb5)}
27.   Rc2 {(:)}
     Nc7 {(:)}
28.   Rc5 {(P1:)}
     bxc5 {(Xc5,P1:bxa5)}
29.   Bxc5 {(Xc5:)}
     Ba6 {(:)}
30.   Bb4 {(:)}
     Bc4 {(:)}
31.   Nb1 {(:)}
     Rea8 {(:)}
32.   Nc3 {(:)}
     Ba2 {(:)}
33.   Nxa4 {(Xa4:)}
     Rxa4 {(Xa4:)}
34.   Qc2 {(:)}
     Ra6 {(:)}
35.   Qa4+ {(CS:)}
     Nb5 {(:Ke8,Kc6,Ne8)}
36.   Qb3 {(:)}
     Na7 {(:)}
37.   a4 {(:)}
     Rc6 {(:)}
38.   Qa3 {(:)}
     Rc7 {(:)}
39.   a5 {(:)}
     Bc4 {(:)}
40.   Bc5 {(:)}
     Kc6 {(:)}
41.   a6 {(:)}
     Nc8 {(:)}
42.   a7 {(:)}
     Ne7 {(:)}
43.   a8=Q+ {(CL:)}
     Rb7 {(:Kb7)}
44.   Qa2 {(:)}
     Bxa2 {(Xa2:Rc7,Ra7,Rb8,Rd7)}
45.   Ke2 {(:)}
     Kc7 {(:Rc7,Ra7,Rb1,Rb8,Rb2,Kc5)}
46.   Ra1 {(:)}
     Nc6 {(:)}
47.   Rxa2 {(Xa2:)}
     Rb8 {(:)}
48.   Kf3 {(:)}
     Kc8 {(:)}
49.   Bf8 {(:)}
     Kc7 {(:d4)}
50.   Be7 {(:)}
     Kc8 {(:)}
51.   Bd8 {(:)}
     Kxd8 {(Xd8:d4,Kc7)}
52.   Rd2 {(:)}
     Ne7 {(:)}
53.   Qxd5+ {(Xd5,CF,P1:)}
     exd5 {(Xd5:)}
54.   Re2 {(:)}
     Rb1 {(:)}
55.   Re5 {(:)}
     Rd1 {(:)}
56.   Rxd5+ {(Xd5,CF:)}
     Nxd5 {(Xd5:)}
57.   g4 {(P1:)}
     fxg4+ {(Xg4,CS:fxe4)}
58.   Kxg4 {(Xg4:)}
     Ne7 {(:)}
59.   f5 {(P1:)}
     gxf5+ {(Xf5,CL:)}
60.   Kh5 {(:)}
     Rf1 {(:)}
61.   g6 {(:)}
     Re1 {(:)}
62.   Kh6 {(:)}
     Re3 {(:)}
63.   Kh7 {(:)}
     Re4 {(:)}
64.   g7 {(:)}
     f4 {(:)}
65.   g8=Q+ {(CR:)}
     Nxg8 {(Xg8:Ke8,Kc8)}
66.   Kxg8 {(Xg8:)}
     Re3 {(:)}
67.   Kf7 {(:)}
     f3 {(:)}
68.   d5 {(:)}
     f2 {(:)}
69.   Kf6 {(:)}
     f1=Q+ {(CF:)}
70.   Kg6 {(:)}
     Qh3 {(:)}
71.   d6 {(:)}
     Rg3+ {(CF:)}
72.   Kf7 {(:)}
     Qg4 {(:)}
73.   d7 {(:)}
     Rg2 {(:Ke7)}
74.   Kf8 {(:)}
     Qg6 {(:Ke7)}
1/2-1/2
*/