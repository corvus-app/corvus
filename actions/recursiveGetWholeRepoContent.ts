import { isExcludedFile } from "@/lib/utils";
import { getRepoContent } from "./getRepoContent";

export async function recursiveGetWholeRepoContent(
  repoName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[],
  data: { [key: string]: string }
) {
  // Using for each or for of loops with async/await does not work as expected
  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  await Promise.all(
    content.map(async (item) => {
      if (isExcludedFile(item.name)) {
        data[item.path] = "";
      } else if (item.type === "file") {
        const fileContent = await getRepoContent(repoName, item.path);
        data[item.path] = atob(fileContent.content).replace("/\n/g", "");
      } else if (item.type === "dir") {
        const dirContent = await getRepoContent(repoName, item.path);
        await recursiveGetWholeRepoContent(repoName, dirContent, data);
      }
    })
  );
  return data;
}
