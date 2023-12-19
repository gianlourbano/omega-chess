/*
 * @jest-environment node
 */

import { GET } from "./route";
import GameLobby from "@/db/models/GameLobby";
import mongoDriver from "@/db/mongoDriver";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import "@testing-library/jest-dom";

jest.mock("@/db/models/GameLobby");
jest.mock("next-auth/jwt");
jest.mock("@/db/mongoDriver");

describe("GET Game Lobby", () => {
    beforeEach(() => {
        // set up the specific return values for each test
        (GameLobby as any).findOne.mockResolvedValue({
            lobbyType: "online",
            whitePlayer: "player1",
            blackPlayer: "player2",
            createdAt: new Date(),
            lookingForPlayer: false,
        });
        (getToken as jest.Mock).mockResolvedValue("tokenfittizio");
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });

    it("returns lobby details if lobby is found and user is logged in", async () => {
     
        const req = {
            nextUrl: new URL("http://localhost/api/games/lobby/mockLobbyId"),
        } as unknown as NextRequest;

        const params = { lobbyId: "mockLobbyId" };

        const result = await GET(req, { params });

        expect(await result.json()).toBeDefined();
    });

    
});

