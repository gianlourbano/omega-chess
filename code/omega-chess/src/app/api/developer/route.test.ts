import { randomBytes } from 'crypto';
import User from '@/db/models/User';
import Token from '@/db/models/Token';
import { POST } from "./route";

jest.mock('@/db/mongoDriver');
jest.mock('@/db/models/User');
jest.mock('@/db/models/Token');

describe('POST /api/developer', () => {
  it('should generate a new token for the user', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'userId', regenerate: false }),
    } as unknown as Request;

    const user = {
      _id: 'userId',
      developer: null,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(user);
    (Token.findOne as jest.Mock).mockResolvedValueOnce(null);
    (randomBytes as jest.Mock).mockReturnValueOnce(Buffer.from('randomToken'));

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it('should return existing token if regenerate is false', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'userId', regenerate: false }),
    } as unknown as Request;

    const user = {
      _id: 'userId',
      developer: null,
    };

    const existingToken = {
      token: 'existingToken',
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(user);
    (Token.findOne as jest.Mock).mockResolvedValueOnce(existingToken);

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it('should generate a new token if regenerate is true', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'userId', regenerate: true }),
    } as unknown as Request;

    const user = {
      _id: 'userId',
      developer: null,
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(user);
    (Token.findOne as jest.Mock).mockResolvedValueOnce(null);
    (randomBytes as jest.Mock).mockReturnValueOnce(Buffer.from('randomToken'));

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it('should return 404 if user is not found', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'nonExistingUserId', regenerate: false }),
    } as unknown as Request;

    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    const response = await POST(req);

    expect(response.status).toBe(404);
  });
});