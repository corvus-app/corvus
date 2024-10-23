import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, rationaleModel } from "..";

/**
 * Determines what to do next in the thought process to get closer to a sufficient answer to the question.
 *
 * This node is given the question, the relevant technologies to the question, and the current state of the thought process.
 * The node is then asked to choose the best option to progress the thought process and get closer to a sufficient answer to the question.
 * The options are: reason (generate rationales), genQuery (generate a search query on the web for relevant documentation on the technologies used in the codebase), and retrieve (retrieve relevant documents from the vector database which consists of code changes and commits to the codebase).
 * The output of this node is the best option chosen by the AI.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<"reason" | "genQuery" | "retrieve">} The best option chosen by the AI.
 */
export async function subGoalSelector(state: typeof GraphState.State) {
  console.log("---SUB GOAL SELECTOR---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question.
    You have expertise in determining what to do next. You will be given a question, the relevant technologies to the question, and the current state of the thought process.

    Here is the question:
    <question>
    {question}
    </question>

    Here are the relevant technologies:
    <technologies>
    {technologies}
    </technologies>

    Here is the current state of the thought process:
    <context>
    {context}
    </context>

    You have three options:
    1. reason (generate rationales). 
    2. genQuery (generate a search query on the web for relevant documentation on the technologies used in the codebase). 
    3. retrieve (retrieve relevant documents from the vector database which consists of code changes and commits to the codebase).

    You are tasked with transferring your domain knowledge by pointing to relevant documents using your sources from the codebase, web, and database if applicable.
    Choose the option to get closer to the best answer to the question. Do not repeat any unneeded steps.
    Give a response 'reason', 'genQuery', or 'retrieve' to indicate what choice you have made.
    Provide the response as a JSON with a single key 'response' and no preamble or explanation.`
  );

  const chain = prompt.pipe(rationaleModel.pipe(new JsonOutputParser()));

  const response: { response: string } = await chain.invoke({
    question: state.question,
    technologies: state.technologies,
    context: state.context,
  });
  console.log(`---SELECTED SUB GOAL: ${response.response}---\n`);

  return response.response;
}
