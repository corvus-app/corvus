import { GraphState } from "..";

export async function answeredQuestion(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const traceback =
    "---ANSWER AND HALLUCINATION GRADER---\n" +
    "---DECISION: SUPPORTED, MOVE TO FINAL GRADE---\n" +
    "---DECISION: USEFUL---\n" +
    state.question +
    "\n";
  return {
    traceback,
  };
}
