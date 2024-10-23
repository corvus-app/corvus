"use server";

import { auth } from "@/auth";

/**
 * Retrieves the content of a repository from a specified path.
 *
 * @param repoName - The name of the repository to retrieve content from.
 * @param path - The path within the repository to retrieve content from.
 * @returns The content of the specified repository path.
 */
export async function getRepoContent(repoName: string, path: string) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${session.user.name}/${repoName}/contents${path}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const data = await response.json();

  return data;
}
