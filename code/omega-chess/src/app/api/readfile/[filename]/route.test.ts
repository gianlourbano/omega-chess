
/**
 * @jest-environment node
*/
import { GET } from './route';
import matter from 'gray-matter';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('gray-matter');

describe('GET function', () => {
  it('returns file content and metadata when file exists', async () => {
    const mockFileContent = 'Mock file content';
    const mockFileMetadata = { title: 'Mock Title', author: 'Mock Author' };
    const mockFilePath = '/mock/path/filename.md';

    // Configura il mock per fs.existsSync per restituire true
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    // Configura il mock per gray-matter.read
    jest.spyOn(matter, 'read').mockReturnValueOnce({
        content: mockFileContent,
        data: mockFileMetadata,
        orig: '',
        language: '',
        matter: '',
        stringify: function (lang: string): string {
            throw new Error('Function not implemented.');
        }
    });

    const fakeReq = {
      method: 'GET',
      params: { filename: 'mockFilename.md' },
    } as unknown as Request;

    const result = await GET(fakeReq, { params: { filename: 'mockFilename.md' } });

    // Assicurati di adattare questi valori in base al tuo caso specifico
    expect(result).toEqual({
      content: mockFileContent,
      fileMetadata: mockFileMetadata,
    });
  });

  it('returns error if file does not exist', async () => {
    // Configura il mock per fs.existsSync per restituire false
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    const fakeReq = {
      method: 'GET',
      params: { filename: 'nonExistentFilename.md' },
    } as unknown as Request;

    const result = await GET(fakeReq, { params: { filename: 'nonExistentFilename.md' } });

    // Assicurati di adattare questi valori in base al tuo caso specifico
    expect(result).toEqual({
      error: 'File not found',
    });
  });

  // Aggiungi altri test secondo necessità
});
