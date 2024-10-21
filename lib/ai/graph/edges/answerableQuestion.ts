import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GraphState, jsonModel } from "..";

/**
 * Determines whether the question is related to the codebase or not.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {"answerable" | "not_answerable"}
 */
export async function answerableQuestion(state: typeof GraphState.State) {
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are an expert at knowing if a question is related to the codebase or not.
    Say yes if it is a question on information on the codebase or github commits in the codebase.
    You do not need to be stringent with the keywords in the question related to these topics.
    Otherwise say no, it is not related to the codebase.

    Here is the question:

    <answer>
    {question}
    </answer>

    Give a binary score 'yes' or 'no' score to indicate whether the answer is grounded in / supported by a set of facts.
    Provide the binary score as a JSON with a single key 'response' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel).pipe(new JsonOutputParser());

  const source: { response: string } = await chain.invoke({
    question: state.question,
  });

  if (source.response === "yes") {
    console.log(`---QUESTION IS ANSWERABLE "${state.question}"---`);
    return "answerable";
  } else {
    console.log(`---QUESTION IS NOT ANSWERABLE "${state.question}"---`);
    return "not_answerable";
  }
}
