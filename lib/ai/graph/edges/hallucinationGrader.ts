import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, jsonModel } from "..";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/**
 * Determines whether the generation is grounded in the document and answers question.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {"supported" | "not supported"}
 */
export async function hallucinationGrader(state: typeof GraphState.State) {
  console.log("---HALLLUCINATION GRADER---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question.
    You have expertise in assessing whether an answer is grounded in / supported by a set of facts.

    Here are the facts used as context to generate the answer:
    <context>
    {context} 
    </context>

    Here is the answer:
    <answer>
    {answer}
    </answer>

    Give a binary score 'yes' or 'no' score to indicate whether the answer is grounded in / supported by a set of facts.
    Provide the binary score as a JSON with a single key 'score' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel.pipe(new JsonOutputParser()));

  const grade: { score: string } = await chain.invoke({
    context: state.context,
    answer: state.answer,
  });

  if (grade.score === "yes") {
    console.log("---DECISION: SUPPORTED, MOVE TO FINAL GRADE---");
    return "supported";
  }

  console.log("---DECISION: NOT SUPPORTED, GENERATE AGAIN---");
  return "not supported";
}
