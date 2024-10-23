"use server";

import { auth } from "@/auth";

/**
 * Retrieves a commit from a GitHub repository.
 *
 * @param repoName - The name of the repository to retrieve the commit from.
 * @param commitId - The ID of the commit to retrieve.
 * @returns The commit data, includes the message, HTML URL, and files.
 */
export async function getCommit(repoName: string, commitId: string) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${session.user.name}/${repoName}/commits/${commitId}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const data = await response.json();

  const relevantData = {
    commitId: commitId,
    commitMessage: data.commit.message,
    htmlURL: data.html_url,
    files: data.files,
  };

  return relevantData;
}
