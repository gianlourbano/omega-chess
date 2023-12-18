
/**
 * @jest-environment node
 */

import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import bcrypt from "bcrypt";
import { POST } from "./route";

jest.mock("@/db/models/User");
jest.mock("@/db/mongoDriver");
jest.mock("bcrypt");

describe("User Registration", () => {
  beforeEach(() => {
    // Mock the mongoDriver
    (mongoDriver as jest.Mock).mockResolvedValue(null);

    // Mock bcrypt functions
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("someSalt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
  });

  it("returns error if username is in use", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ username: "existingUser" });

    const req = {
      json: jest.fn().mockResolvedValue({
        username: "existingUser",
        password: "password123",
        email: "test@test.com",
      }),
    };

    const response = await POST(req as any);

    expect(response).toEqual({
      error: "Username already in use.",
      status: 400,
    });
  });



  it("registers user successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    const req = {
      json: jest.fn().mockResolvedValue({
        username: "newUser",
        password: "password123",
        email: "new@test.com",
      }),
    };

    const response = await POST(req as any);

    expect(response).toEqual({
      message: "User registered successfully",
      status: 200,
    });
  });
});


