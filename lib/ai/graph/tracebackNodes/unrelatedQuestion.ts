import { GraphState } from "..";

/**
 * If the question is not related to the codebase, this node is responsible for ending the thought process.
 * The output of this node is a traceback that indicates the question is not related to the codebase.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function unrelatedQuestion(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const traceback = "---QUESTION IS NOT RELATED---\n" + state.question + "\n";
  return {
    traceback,
  };
}
