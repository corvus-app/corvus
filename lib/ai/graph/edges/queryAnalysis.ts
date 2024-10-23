import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GraphState, jsonModel } from "..";

/**
 * Analyzes a given question to determine if it is related to coding.
 *
 * The function uses a language model to evaluate whether the question pertains
 * to coding by providing a binary response ('yes' or 'no'). The result is
 * returned as either "related" or "not_related" based on the model's assessment.
 *
 * @param {typeof GraphState.State} state - The current state of the graph, containing the question.
 * @returns {Promise<"related" | "not_related">}
 */
export async function queryAnalysis(state: typeof GraphState.State) {
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are an expert at knowing if a question is related to corvus the codebase or coding.
    Say yes if it is a question on information involving corvus the codebase or code.
    You do not need to be stringent with the keywords in the question related to these topics.
    Otherwise say no, it is not related to corvus the codebase or coding.

    Here is the question:

    <question>
    {question}
    </question>

    Give a binary score 'yes' or 'no' score to indicate whether the answer is related to corvus the codebase or coding.
    Provide the binary score as a JSON with a single key 'response' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel).pipe(new JsonOutputParser());

  const source: { response: string } = await chain.invoke({
    question: state.question,
  });

  if (source.response === "yes") {
    console.log(`---QUESTION IS RELATED "${state.question}"---\n`);
    return "related";
  } else {
    console.log(`---QUESTION IS NOT RELATED "${state.question}"---\n`);
    return "not_related";
  }
}
