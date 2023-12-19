import { randomBytes } from 'crypto';
import User from '@/db/models/User';
import Token from '@/db/models/Token';
import { POST } from "./route";

jest.mock('@/db/mongoDriver');
jest.mock('@/db/models/User');
jest.mock('@/db/models/Token');

describe('POST /api/developer', () => {

  it('should return existing token if regenerate is false', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'userId', regenerate: false }),
    } as unknown as Request;

    const user = {
      _id: 'userId',
      developer: null,
      save: jest.fn().mockResolvedValueOnce(null)
    };

    const existingToken = {
      token: 'existingToken',
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(user);
    (Token.findOne as jest.Mock).mockResolvedValueOnce(existingToken);
    (user.save as jest.Mock).mockResolvedValueOnce(null);


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
    (randomBytes as jest.Mock).mockReturnValueOnce('randomToken');
    (User.save as jest.Mock).mockResolvedValueOnce(null);

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it('should return 404 if user is not found', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'nonExistingUserId', regenerate: false }),
    } as unknown as Request;

    const response = await POST(req);
    
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    expect(response.status).toBe(404);
  });
});


/*


FAIL src/app/api/developer/route.test.ts
  ● POST /api/developer › should generate a new token if regenerate is true

    TypeError: _crypto.randomBytes.mockReturnValueOnce is not a function

      47 |     (User.findById as jest.Mock).mockResolvedValueOnce(user);
      48 |     (Token.findOne as jest.Mock).mockResolvedValueOnce(null);
    > 49 |     (randomBytes as jest.Mock).mockReturnValueOnce('randomToken');
         |                                ^
      50 |     (User.save as jest.Mock).mockResolvedValueOnce(null);
      51 |
      52 |     const response = await POST(req);

      at Object.mockReturnValueOnce (src/app/api/developer/route.test.ts:49:32)

  ● POST /api/developer › should return 404 if user is not found

    TypeError: user.save is not a function

      38 |     }
      39 |
    > 40 |     await user.save();
         |                ^
      41 |
      42 |     return Response.json({token}, {status: 200})
      43 |

      at save (src/app/api/developer/route.ts:40:16)
      at Object.<anonymous> (src/app/api/developer/route.test.ts:62:22)

*/