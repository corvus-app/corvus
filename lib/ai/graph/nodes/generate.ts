import { GraphState, model } from "..";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

/**
 * Generate answer
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function generate(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---GENERATE---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a senior developer with extensive experience and domain knowledge of the codebase.
    You are tasked with transferring your domain knowledge to junior developrs by pointing them to the relevant codebase documents.
    You will be given a list of relevant commits and changes to the codebase. 
    These are the relevant codebase documents: {context}.
    You will not generate any new code and will only respond with facts based on the relevant codebase documents.
    Your answer should be concise and include the relevant commits and documentatation that you used.
    Here is the question: {question}.
    `
  );

  // Construct the RAG chain by piping the prompt, model, and output parser
  const ragChain = prompt.pipe(model).pipe(new StringOutputParser());

  const generation = await ragChain.invoke({
    context: formatDocumentsAsString(state.documents),
    question: state.question,
  });

  return {
    generation,
  };
}
