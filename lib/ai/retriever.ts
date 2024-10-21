import { client } from "../mongoClient";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { embeddings } from "./embeddings";

const database = client.db("corvus");
const githubCommitsEmbeddings = database.collection(
  "github_commits_embeddings"
);

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: githubCommitsEmbeddings,
  indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
  textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
  embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
});

export const retriever = vectorStore.asRetriever({
  k: 7,
  //   searchType: "mmr", // Defaults to "similarity
  //   searchKwargs: {
  //     fetchK: 50,
  //     lambda: 0.1,
  //   },
});
