import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
  }
}