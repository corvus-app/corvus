import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, summarizerModel } from "..";
import { retriever } from "../../retriever";

/**
 * This node is responsible for retrieving relevant documents from the codebase given a question.
 * The node takes in the question and uses the retriever to fetch relevant documents from the codebase.
 * The node then asks the AI to summarize the documents by identifying the commit ID, commit message, the source file, and the contents.
 * The output of this node is a string that contains the summarized documents, with each document on a new line, and the index of the document in parentheses.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function retrieve(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---RETRIEVE---");
  const documents = await retriever.invoke(state.question);

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are an expert in deciphering GitHub commits. You will be given a GitHub commit.
    You are tasked with summarizing the commit by identifying the commit ID, commit message, the source file, and the contents.
    
    Here is the commit:
    <commit>
    {commit}
    </commit>
    
    In under three sentences, provide a succinct summary of the commit with no preamble or explanation.
    `
  );

  const ragChain = prompt.pipe(summarizerModel).pipe(new StringOutputParser());

  let options: string = "";
  for (let i = 0; i < documents.length; i++) {
    const summarizedPage = await ragChain.invoke({
      commit: documents[i].pageContent,
    });

    options += i + 1 + ". " + summarizedPage + "\n";
  }
  console.log(options);

  const traceback =
    "---SUB GOAL SELECTOR---\n" +
    "---SELECTED SUB GOAL: retrieve---\n" +
    "---RETRIEVED DOCUMENTS---\n";
  options + "\n";

  return {
    options,
    traceback,
  };
}
