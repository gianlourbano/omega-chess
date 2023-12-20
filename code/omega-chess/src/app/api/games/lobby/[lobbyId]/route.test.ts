/*
 * @jest-environment node
 */

import { GET } from "./route";
import GameLobby from "@/db/models/GameLobby";
import mongoDriver from "@/db/mongoDriver";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import "@testing-library/jest-dom";
import { get } from "http";

jest.mock("@/db/models/GameLobby");
jest.mock("next-auth/jwt");
jest.mock("@/db/mongoDriver");

describe("GET Game Lobby", () => {
    beforeEach(() => {
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

    it("returns error if lobby is not found", async () => {
        const req = {
            nextUrl: new URL("http://localhost/api/games/lobby/mockLobbyId"),
        } as unknown as NextRequest;

        const params = { lobbyId: "mockLobbyId" };
        (GameLobby as any).findOne.mockResolvedValue(null);
        const result = await GET(req, { params });

        expect(await result.json()).toEqual({ error: "lobby not found" });
    });

    it("returns error if token is not found", async () => {
        const req = {
            nextUrl: new URL("http://localhost/api/games/lobby/mockLobbyId"),
        } as unknown as NextRequest;

        const params = { lobbyId: "mockLobbyId" };
        (getToken as jest.Mock).mockResolvedValue(null);
        const result = await GET(req, { params });
        expect(await result.json()).toEqual({ error: "not logged in" });
    });

    it("returns error if user is not in lobby", async () => {
        const req = {
            nextUrl: new URL("http://localhost/api/games/lobby/mockLobbyId"),
        } as unknown as NextRequest;
        const params = { lobbyId: "mockLobbyId" };
        (GameLobby as any).findOne.mockResolvedValue({
            lobbyType: "online",
            whitePlayer: "player1",
            blackPlayer: "player2",
            createdAt: new Date(),
            lookingForPlayer: false,
        });

        (getToken as jest.Mock).mockResolvedValue("tokenfittizio");
        const result = await GET(req, { params });
        expect(await result.json()).toEqual({ error: "not in lobby" });
    });

    it("returns error if lobby is full", async () => {
        const req = {
            nextUrl: new URL("http://localhost/api/games/lobby/mockLobbyId?join=true"),
        } as unknown as NextRequest;
        const params = { lobbyId: "mockLobbyId" };
        (GameLobby as any).findOne.mockResolvedValue({
            lobbyType: "online",
            whitePlayer: "player1",
            blackPlayer: "player2",
            createdAt: new Date(),
            lookingForPlayer: true,
        });

        (getToken as jest.Mock).mockResolvedValue("tokenfittizio");
        const result = await GET(req, { params });
        expect(await result.json()).toEqual({ error: "lobby full" });
    });
});

