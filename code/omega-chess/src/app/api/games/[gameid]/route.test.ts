/*
 * @jest-environment node
 */

import supertest from "supertest";
import { GET } from "./route.js";
import mongoDriver from "@/db/mongoDriver";
import Game from "@/db/models/Game";

jest.mock("@/db/mongoDriver", () => jest.fn());
jest.mock("@/db/models/Game", () => ({
    findOne: jest.fn(),
}));

const request = supertest.agent("http://omega-chess.ddns.net/");

describe("GET API Endpoint", () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });

    it("should return a game when it exists", async () => {
        const mockGame = { _id: "mockGameId" };
        const mockParams = { gameid: "mockGameId" };

        (Game.findOne as jest.Mock).mockResolvedValueOnce(mockGame);

        const response = await request.get(`/api/games/${mockParams.gameid}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockGame);
    });

    it("should return an error when the game is not found", async () => {
        const mockParams = { gameid: "nonexistentGameId" };

        (Game.findOne as jest.Mock).mockResolvedValueOnce(null);

        const response = await request.get(`/api/games/${mockParams.gameid}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Game not found" });
    });
});
