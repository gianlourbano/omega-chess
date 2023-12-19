/*
 * @jest-environment node
*/

import { GET, PUT } from './route';
import User from '@/db/models/User';
import mongoDriver from '@/db/mongoDriver';
import exp from 'constants';
import bcrypt from 'bcrypt';
import { m } from 'framer-motion';
import { mock } from 'node:test';


jest.mock('@/db/models/User');
jest.mock('@/db/models/Token');
jest.mock('@/db/models/DeveloperCustom');
jest.mock('@/db/mongoDriver');
jest.mock('bcrypt');



describe("api/users/[username] PUT function", () => {
    beforeEach(() => {
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });

    it("returns 200 when user exists", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                newUsername: "newUsername",
                newEmail: "newEmail",
                oldPassword: "oldPassword",
                newPassword: "newPassword",
                newFriend: "newFriend",
                //removeFriend: "removeFriend",
                developer: true
            })
        };


        const mockFriendFriend = {
            username: "newFriend2",
            email: "newEmail2",
            save: jest.fn().mockResolvedValue(true),
        };

        const mockFriend = {
            username: "newFriend",
            email: "newEmail",
            friends: [mockFriendFriend],
            save: jest.fn().mockResolvedValue(true),
        };
        
        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            friends: [mockFriend],
            save: jest.fn().mockResolvedValue(true),

        };

        //developer if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        
        //newUsername if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

        //newEmail if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

        //newPassword if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
        (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce("newSaltXd");
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

        //newFriend if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockFriend);
        
        /*
        //removeFriend if statement
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockFriend);
        */

        
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(200)
        
    });

    it("should return 400 when username is already in use", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                newUsername: "newUsername",
                newEmail: "newEmail",
                //oldPassword: "oldPassword",
                //newPassword: "newPassword",
                //newFriend: "newFriend",
                //removeFriend: "removeFriend",
                //developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };

        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    })

    it("should return 400 when email is already in use", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                //newUsername: "newUsername",
                newEmail: "newEmail",
                //oldPassword: "oldPassword",
                //newPassword: "newPassword",
                //newFriend: "newFriend",
                //removeFriend: "removeFriend",
                //developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };

        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    });

    it("should return 400 when old password is not provided", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                //newUsername: "newUsername",
                //newEmail: "newEmail",
                //oldPassword: "passowrd",
                newPassword: "password",
                //newFriend: "newFriend",
                //removeFriend: "removeFriend",
                //developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };

        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    });

    it("should return 400 when passwords do not match", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                //newUsername: "newUsername",
                //newEmail: "newEmail",
                oldPassword: "oldPassword",
                newPassword: "newPassword",
                //newFriend: "newFriend",
                //removeFriend: "removeFriend",
                developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };

        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    });

    it("should return 400 when new friend is not provided", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                //newUsername: "newUsername",
                //newEmail: "newEmail",
                //oldPassword: "oldPassword",
                //newPassword: "newPassword",
                newFriend: "existingUser",
                //removeFriend: "removeFriend",
                developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };
        
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);
        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    });

    it("should return 400 when new friend is not found", async () => {
        const mockParams = { params: { username: "existingUser" } };
        const req = {
            json: jest.fn().mockResolvedValue({
                //newUsername: "newUsername",
                //newEmail: "newEmail",
                //oldPassword: "oldPassword",
                //newPassword: "newPassword",
                newFriend: "existingUser",
                //removeFriend: "removeFriend",
                developer: false
            })
        };

        const mockUser = {
            username: "newUsername",
            role: "developer",
            email: "newEmail",
            password: "oldPassword",
            salt: "newSaltXd",
            save: jest.fn().mockResolvedValue(true),
        };
        
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);

        const response = await PUT(req as any, mockParams as any);
        expect(response.status).toBe(400);
    });
});


/* questo test non è male ma non sappiamo come simulare populate
    praticamente essendo populate una funzione e non una promessa non va bene il mock solito (quello di findOne)

describe('api/users/[username] GET function', () => {
    beforeEach(() => {
        (mongoDriver as jest.Mock).mockResolvedValue(null);
    });
    
    it('returns 200 when user exists', async () => {
        const mockParams = { params: { username: 'existingUser' } };
        
        const mockUser = {
            username: 'existingUser',
            friends: ['friend1', 'friend2'],
            email: 'email',
            scores: ['score1', 'score2'],
            games: ['game1', 'game2']
        };
        
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

        const mockPopulate = jest.fn().mockResolvedValueOnce(mockUser);
        (User.findOne as jest.Mock).mockReturnValueOnce({
            populate: mockPopulate,
        });
        
        const response = await GET(null as any, mockParams as any);
        expect(response.status).toBe(200);
    });
});
*/
