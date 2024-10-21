import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, jsonModel } from "..";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/**
 * Determines whether the generation addresses the question.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {"useful" | "not useful"}
 */
export async function answerGrader(state: typeof GraphState.State) {
  console.log("---ANSWER GRADER---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a grader assessing whether an answer is useful to resolve a question.
    Here is the answer:

    <answer>
    {generation} 
    </answer>

    Here is the question:

    <question>
    {question}
    </question>

    Give a binary score 'yes' or 'no' to indicate whether the answer is useful to resolve a question.
    Provide the binary score as a JSON with a single key 'score' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel).pipe(new JsonOutputParser());

  const grade: { score: string } = await chain.invoke({
    question: state.question,
    generation: state.generation,
  });

  if (grade.score === "yes") {
    console.log("---DECISION: USEFUL---");
    return "useful";
  }

  console.log("---DECISION: NOT USEFUL---");
  return "not_useful";
}
