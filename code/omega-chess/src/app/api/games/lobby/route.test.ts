/*
 * @jest-environment node
*/

import { POST, DELETE} from './route';
import User from '@/db/models/User';
import mongoDriver from '@/db/mongoDriver';
import exp from 'constants';
import bcrypt from 'bcrypt';
import { m } from 'framer-motion';
import { mock } from 'node:test';
import GameLobby from '@/db/models/GameLobby';


jest.mock('@/db/models/User');
jest.mock('@/db/models/Token');
jest.mock('@/db/models/GameLobby');
jest.mock('@/db/models/DeveloperCustom');
jest.mock('@/db/mongoDriver');
jest.mock('bcrypt');


describe("DELETE api/games/lobby", () => {
    
    it("should return 'OK' when trying to delete a lobby", async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                room: "room",
        })};
        (GameLobby.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

        const response = await DELETE(req as any);
        expect(response.status).toBe(200);
    })

})
