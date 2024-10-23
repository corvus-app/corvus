"use server";

import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "@/lib/ai/embeddings";

export async function search(input: string) {
  const tool = new GoogleCustomSearch({
    apiKey: process.env.GOOGLE_API_KEY,
    googleCSEId: process.env.GOOGLE_CSE_ID,
  });

  const results = await tool.invoke(input);
  const parsedResults = JSON.parse(results);

  const topThreeSites = parsedResults.slice(0, 3);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 1,
  });

  const vectorStore = new MemoryVectorStore(embeddings);

  topThreeSites.forEach(async (site: { link: string }) => {
    const loader = new CheerioWebBaseLoader(site.link);
    const docs = await loader.load();
    const splitDocs = await textSplitter.splitDocuments(docs);
    await vectorStore.addDocuments(splitDocs);
  });

  return vectorStore;
}
