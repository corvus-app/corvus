import { GraphState } from "..";
import { answerGrader } from "./answerGrader";
import { hallucinationGrader } from "./hallucinationGrader";

/**
 * Combines hallucination and answer grader.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<"useful" | "not_useful" | "not_supported">} Whether the
 * generation is useful, not useful, or not supported.
 */
export async function answerAndHallucinationsGrader(
  state: typeof GraphState.State
) {
  const hallucinationGrade = await hallucinationGrader(state);
  if (hallucinationGrade === "supported") {
    const answerGrade = await answerGrader(state);
    return answerGrade;
  } else {
    return "not_supported";
  }
}
