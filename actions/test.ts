"use server";

import { client } from "@/lib/mongoClient";
import { isExcludedFile } from "@/lib/utils";
import { getCommit } from "./atlas/getCommit";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { embeddings } from "@/lib/ai/embeddings";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function test() {
  // Configure Atlas collection
  const database = client.db("corvus");
  const githubCommits = database.collection("github_commits");
  const githubCommitsEmbeddings = database.collection(
    "github_commits_embeddings"
  );
  const dbConfig = {
    collection: githubCommitsEmbeddings,
    indexName: "vector_index", // The name of the Atlas search index to use.
    textKey: "text", // Field name for the raw text content. Defaults to "text".
    embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
  };

  let docs: Document[] = [];
  const commits = githubCommits.find({});
  for await (const commit of commits) {
    try {
      const commitData = await getCommit("corvus", commit.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commitData?.files.forEach(async (file: any) => {
        if (isExcludedFile(file.filename)) {
          return;
        }
        const doc = new Document({
          pageContent:
            `COMMIT ID: ${commit.id}\nCOMMIT MESSAGE: ${commit.data.commit.message}\nSOURCE: ${file.filename}\n` +
            file.patch,
          metadata: {
            commit_id: commit.id,
            commit_message: commit.data.commit.message,
            html_url: commit.data.html_url,
            source: file.filename,
          },
        });
        docs = docs.concat([doc]);
      });
    } catch (error) {
      return error;
    }
  }

  const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
    docs,
    embeddings,
    dbConfig
  );
}
