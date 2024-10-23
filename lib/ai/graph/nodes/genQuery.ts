import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import { GraphState, summarizerModel } from "..";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "../../embeddings";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Uses Google Custom Search to find a webpage that is relevant to the question
 * and the technologies found in the question. Then, it uses the MemoryVectorStore
 * and the RecursiveCharacterTextSplitter to split the webpage into chunks and
 * embed them. Finally, it uses the Google Generative AI embeddings to search
 * for the most relevant chunks and then summarizes the content of the most
 * relevant chunks using the summarizerModel.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function genQuery(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---GENERAL QUERY---");
  const tool = new GoogleCustomSearch();

  const results = await tool.invoke(state.technologies + " " + state.question);
  const parsedResults = JSON.parse(results);
  const site = parsedResults[0];

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 0,
  });

  const vectorStore = new MemoryVectorStore(embeddings);

  const loader = new CheerioWebBaseLoader(site.link);
  const docs = await loader.load();
  const splitDocs = await textSplitter.splitDocuments(docs);

  await vectorStore.addDocuments(splitDocs);

  const documents = await vectorStore.similaritySearch(
    state.technologies + " " + state.question,
    3
  );

  const prompt = ChatPromptTemplate.fromTemplate(
    "Summarize the following page in under three sentences: {pageContent}"
  );

  const ragChain = prompt.pipe(summarizerModel).pipe(new StringOutputParser());

  let options: string = "";
  for (let i = 0; i < documents.length; i++) {
    const summarizedPage = await ragChain.invoke({
      pageContent: documents[i].pageContent,
    });

    options += i + 1 + ". " + summarizedPage + "\n";
  }

  console.log(options);
  const traceback =
    "---SUB GOAL SELECTOR---\n" +
    "---SELECTED SUB GOAL: genQuery---\n" +
    "---WEB SEARCH---\n" +
    options +
    "\n";

  return {
    options,
    traceback,
  };
}
