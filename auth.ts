import NextAuth from "next-auth";
import GitHub from "./githubProvider";

export const { handlers, auth } = NextAuth({
  providers: [GitHub("repo admin:repo_hook")],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      // Update the session username (currently user's real name) to Github username
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await response.json();

      session.user.name = data.login;

      return session;
    },
    async jwt({ token, account }) {
      // Persist the GitHub access token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
