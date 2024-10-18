// Modify session type to include token for GitHub
// https://stackoverflow.com/questions/78178875/next-auth-get-token-for-github-rest-api

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    expires: string;
    user: {
      address: string;
    } & DefaultSession["user"];
  }
}
