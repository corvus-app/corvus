import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, jsonModel } from "..";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/**
 * Grades an answer based on whether it resolves the question by providing a sufficient amount of relevant links, GitHub commits, and documents.
 *
 * The function takes the current state of the graph, containing the question and the answer.
 * The function returns a promise that resolves to a string indicating whether the answer is useful or not useful.
 * The returned string can be either "useful" or "not_useful".
 *
 * The function uses a language model to evaluate the answer based on the question.
 * The language model is given the question and the answer, and is asked to provide a binary score 'yes' or 'no' to indicate whether the answer resolves the question.
 * The binary score is then returned as either "useful" or "not_useful".
 * @param {typeof GraphState.State} state - The current state of the graph, containing the question.
 * @returns {Promise<"useful" | "not_useful">} - A promise that resolves to a string indicating whether the question is related to coding.
 */
export async function answerGrader(state: typeof GraphState.State) {
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question.
    You have expertise in determining whether an answer mentions a sufficient amount of relevant links, GitHub commits and documents that resolve the question.

    Here is the answer:
    <answer>
    {answer} 
    </answer>

    Here is the question:
    <question>
    {question}
    </question>

    Give a binary score 'yes' or 'no' to indicate whether the answer resolves the question.
    Provide the binary score as a JSON with a single key 'score' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel).pipe(new JsonOutputParser());

  const grade: { score: string } = await chain.invoke({
    question: state.question,
    answer: state.answer,
  });

  if (grade.score === "yes") {
    console.log("---DECISION: USEFUL---");
    return "useful";
  } else {
    console.log("---DECISION: NOT USEFUL---");
    return "not_useful";
  }
}
