import { GraphState } from "..";

export async function answeredQuestion(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  const traceback = "---ANSWER RESOLVES QUESTION---\n" + state.question + "\n";
  return {
    traceback,
  };
}
