import { randomBytes } from 'crypto';
import User from '@/db/models/User';
import Token from '@/db/models/Token';
import { POST } from "./route";

jest.mock('@/db/mongoDriver');
jest.mock('@/db/models/User');
jest.mock('@/db/models/Token');
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

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
      save: jest.fn().mockResolvedValueOnce(null)
    };

    (User.findById as jest.Mock).mockResolvedValueOnce(user);
    (Token.findOne as jest.Mock).mockResolvedValueOnce(null);
    (randomBytes as jest.Mock).mockReturnValueOnce(Buffer.from('randomToken'));
    (user.save as jest.Mock).mockResolvedValueOnce(null);

    const response = await POST(req);

    expect(response.status).toBe(200);
  });

  it('should return 404 if user is not found', async () => {
    const req: Request = {
      json: jest.fn().mockResolvedValueOnce({ id: 'nonExistingUserId', regenerate: false }),
    } as unknown as Request;

    const response = await POST(req);
    
    (User.findById as jest.Mock).mockResolvedValue(null);

    expect(response.status).toBe(404);
  });
});


/*
FAIL src/app/api/developer/route.test.ts
  ● POST /api/developer › should generate a new token if regenerate is true

    TypeError: Cannot read properties of undefined (reading 'mockResolvedValueOnce')

      51 |     (Token.findOne as jest.Mock).mockResolvedValueOnce(null);
      52 |     (randomBytes as jest.Mock).mockReturnValueOnce('randomToken');
    > 53 |     (User.save as jest.Mock).mockResolvedValueOnce(null);
         |                              ^
      54 |
      55 |     const response = await POST(req);
      56 |

      at Object.mockResolvedValueOnce (src/app/api/developer/route.test.ts:53:30)

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
      at Object.<anonymous> (src/app/api/developer/route.test.ts:65:22)
*/