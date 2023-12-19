
/**
 * @jest-environment node
*/
import { GET } from './route';
import matter from 'gray-matter';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('gray-matter');

describe('GET function', () => {
  it('returns 200 when file exists', async () => {
    const mockParams = {params: { filename: "existingFile" }};
    const mockFileContent = 'Mock file content';
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    (matter.read as jest.Mock).mockReturnValueOnce({content: mockFileContent, data: {}});

    const response = await GET(null as any, mockParams as any);
    expect(response.status).toBe(200);
  });
    
  it('returns 404 when file does not exist', async () => {
    const mockParams = {params: { filename: "nonExistingFile" }};
    const mockFileContent = 'Mock file content';
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

    const response = await GET(null as any, mockParams as any);
    expect(response.status).toBe(404);
  });
});


