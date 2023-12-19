/*
 * @jest-environment node
 */

import supertest from "supertest";
import { GET } from "./route";
import mongoDriver from "@/db/mongoDriver";
import Game from "@/db/models/Game";

jest.mock("@/db/mongoDriver");
jest.mock("@/db/models/Game");

describe("GET API Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a game when it exists", async () => {
        const mockGame = { _id: "existingGame" };
        const mockParams = {params: { gameid: "existingGame" }};
        (Game.findOne as jest.Mock).mockResolvedValueOnce(mockGame);

        const response = await GET(null as any, mockParams as any);
        expect(response.status).toBe(200);
    });

    it("should return an error when the game is not found", async () => {
        const mockParams = {params: { gameid: "nonExistingGame" }};
        (Game.findOne as jest.Mock).mockResolvedValueOnce(null);
        
        const response = await GET(null as any, mockParams as any);
        expect(response.status).toBe(404);
    });
});

