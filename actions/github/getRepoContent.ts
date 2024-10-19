"use server";

import { auth } from "@/auth";

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
