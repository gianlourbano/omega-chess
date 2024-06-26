/*
 * @jest-environment node
*/ 


import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextRequest } from 'next/server';
import { GET } from './route'; 

// Mocking fs and gray-matter
/*
jest.mock('fs');
jest.mock('gray-matter', () => {
  return jest.fn().mockImplementation((input) => {
    return {
      data: {
        title: "Titolo Fittizio",
        date: "2023-01-01",
        author: "Autore Fittizio"
      },
      content: 'Contenuto fittizio del file'
    };
  });
});
*/

describe('Release Functions', () => {
/*
  beforeEach(() => {
    // Set up your mock data
    const mockFiles = ['release-1.0.0.md', 'release-1.1.0.md'];
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
    });
  });
  */

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets releases correctly', async () => {
    const releases = await GET();
    expect(releases).toBeDefined
  });

  

});
