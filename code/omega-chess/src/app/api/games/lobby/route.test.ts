/**
 * @jest-environment node
*/
import { POST } from './route';
import GameLobby from '@/db/models/GameLobby';

describe('POST', () => {
  it('should create a new game lobby and return the lobby details', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ gameType: 'darkboard', player: 'John' }),
    } as unknown as Request;

    const response = await POST(req);

    const res = await response.json();

    expect(res).toEqual({
      id: expect.any(String),
      whitePlayer: 'John',
      blackPlayer: "darkboard",
    });
  });

  it('should return an existing game lobby if the player is already in a lobby', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ gameType: 'darkboard', player: 'John' }),
    } as unknown as Request;

    const existingGame = {
      _id: 'existingId',
      whitePlayer: 'John',
      blackPlayer: null,
    };

    jest.spyOn(GameLobby, 'findOne').mockResolvedValueOnce(existingGame);

    const response = await POST(req);
    const res = await response.json();


    expect(res).toEqual({
      id: 'existingId',
      whitePlayer: 'John',
      blackPlayer: null,
    });
  });
});