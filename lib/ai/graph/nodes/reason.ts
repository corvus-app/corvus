import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, rationaleModel } from "..";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Reasons 3 possible rationales to progress the thought process and get closer to a sufficient answer to the question.
 * The AI is given the question, the relevant technologies to the question, and the current state of the thought process.
 * The AI is then asked to reason 3 possible rationales to progress the thought process and get closer to a sufficient answer to the question.
 * The output of this node is 3 possible rationales in one paragraph and numbered 1 to 3.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function reason(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---REASON---");
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question. 
    You have expertise in critical problem-solving and reasoning skills.
    You will be given a question, the relevant technologies to the question, and the current state of the thought process.
    Reason 3 possible rationales to progress the thought process and get closer to a sufficient answer to the question.

    Here is the question:
    <question>
    {question}
    </question>

    Here are the relevant technologies:
    <technologies>
    {technologies}
    </technologies>

    Here is the current state of the thought process:
    <context>
    {context}
    </context>
    
    Give your rationales in one paragraph and numbered 1 to 3. Do not add any preamble.`
  );

  const chain = prompt.pipe(rationaleModel).pipe(new StringOutputParser());

  const options = await chain.invoke({
    question: state.question,
    technologies: state.technologies,
    context: "---REASON---\n" + state.context + "\n",
  });

  console.log(options);
  const traceback =
    "---SUB GOAL SELECTOR---\n" +
    "---SELECTED SUB GOAL: reason---\n" +
    "---GENERATE RATIONALES---\n" +
    options +
    "\n";

  return {
    options,
    traceback,
  };
}
