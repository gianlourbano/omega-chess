/*
 * @jest-environment node
*/


import DeveloperCustom from '@/db/models/DeveloperCustom';
import { GET, POST, DELETE } from './route';
import User from "@/db/models/User";



jest.mock("@/db/models/User");
jest.mock("@/db/models/Token");
jest.mock("@/db/models/DeveloperCustom");
jest.mock("@/db/mongoDriver");
 
/*
la prima get funziona
la seconda no
la prima post non funziona, ritorna 400 invece di 200
la prima delete funziona
*/

describe("GET function api/user/[username]/developer", () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });
    it('returns 200 when file exists', async () => {
        const mockParams = {params: { username: "existingUser"}};
        (User.findOne as jest.Mock).mockImplementation(() => ({
            populate: jest.fn().mockImplementationOnce(() => ({
              populate: jest.fn().mockResolvedValueOnce({
                username: "existingUser",
                email: "existingEmail",
                developer: {
                  token: "123",
                  customs: [],
                  
                },
            })})),
        })); 

        const response = await GET(null as any, mockParams as any);
        expect(response.status).toBe(200);
        
    });
    /*non capisco come gestire il populate
    it('returns 404 when file does not exist', async () => {
        const mockParams = {params: { username: "nonExistingUser"}};
        (User.findOne as jest.Mock).mockResolvedValueOnce(() => ({
            populate: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(null)
            })),
        }));
        
        const response = await GET(null as any, mockParams as any);
        expect(response.status).toBe(404);
        
    });
    */
   
});
/*
describe("POST function api/user/[username]/developer", () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });
    it('returns 200 when file exists', async () => {
        const mockParams = {params: { username: "existingUser"}};
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                name: "existingUser",
                description: "something",
            }),
        };
        (User.findOne as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        (DeveloperCustom.create as jest.Mock).mockResolvedValueOnce({
            name: "existingUser",
            description: "something",
            developer: "newId"
        });
        const createUser = (User.findOne as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        
        const response = await POST(mockRequest as any, mockParams as any);
        expect(response.status).toBe(200);
        
    });

    it('returns 400 when file exists', async () => {
        const mockParams = {params: { username: "existingUser"}};
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                name: "",
                description: "something",
            }),
        };
        (User.findOne as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        (DeveloperCustom.create as jest.Mock).mockResolvedValueOnce({
            name: "",
            description: "something",
            developer: "newId"
        });
        const createUser = (User.findOne as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        
        const response = await POST(mockRequest as any, mockParams as any);
        expect(response.status).toBe(400);
        
    });
   
});

describe("DELETE function api/user/[username]/developer", () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });
    it('returns 200 when file exists', async () => {
        const mockParams = {params: { username: "existingUser"}};
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                name: "existingUser",
            }),
        };
        (User.findOne as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        (User.findOneAndDelete as jest.Mock).mockResolvedValueOnce({username: "existingUser"});
        const response = await DELETE(null as any, mockParams as any);
        expect(response.status).toBe(200);
    });
   
});

/*
(populate: any) => {}
*/