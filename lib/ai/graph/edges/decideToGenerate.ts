import { GraphState } from "..";

/**
 * Decide whether the current documents are sufficiently relevant to come up with a good answer.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {"rewriteQuery" | "generate"} Next node to call
 */
export async function decideToGenerate(state: typeof GraphState.State) {
  console.log("---DECIDE TO GENERATE---");

  const filteredDocs = state.documents;
  if (filteredDocs.length === 0) {
    // All documents have been filtered as irrelevant
    // Regenerate a new query and try again
    console.log(
      "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, REWRITE QUERY---"
    );
    return "rewriteQuery";
  }

  // We have relevant documents, so generate answer
  console.log("---DECISION: GENERATE---");
  return "generate";
}
