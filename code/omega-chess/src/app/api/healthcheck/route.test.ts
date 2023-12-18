/**
 * @jest-environment node
*/
import { GET } from "./route";

describe("GET", () => {
    it("should return a JSON response with status 200", async () => {
        const response = await GET();
        expect(response.status).toBe(200);
    });
    
});
