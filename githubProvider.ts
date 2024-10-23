/* eslint-disable @typescript-eslint/no-explicit-any */

// Modified Auth.js' GitHub provider so you can change the scopes
// Why don't they let you do this in the first place??? (October 2024)

// See https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes for all available scopes

import { OAuthConfig } from "next-auth/providers";
import { GitHubEmail, GitHubProfile } from "next-auth/providers/github";

/**
 * A custom NextAuth.js provider for GitHub that allows you to pass in any valid
 * scope parameter. This is useful if you want to request different permissions
 * from the user.
 *
 * @param scope A string of space-separated scopes to request from the user.
 * @returns The GitHub provider configuration.
 */
export default function GitHub(scope: string): OAuthConfig<GitHubProfile> {
  const baseUrl = "https://github.com";
  const apiBaseUrl = "https://api.github.com";

  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/login/oauth/authorize`,
      params: { scope: scope },
    },
    token: `${baseUrl}/login/oauth/access_token`,
    userinfo: {
      url: `${apiBaseUrl}/user`,
      async request({ tokens, provider }: any) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        }).then(async (res) => await res.json());

        if (!profile.email) {
          // If the user does not have a public email, get another via the GitHub API
          // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
          const res = await fetch(`${apiBaseUrl}/user/emails`, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": "authjs",
            },
          });

          if (res.ok) {
            const emails: GitHubEmail[] = await res.json();
            profile.email = (emails.find((e) => e.primary) ?? emails[0]).email;
          }
        }

        return profile;
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: { bg: "#24292f", text: "#fff" },
  };
}
