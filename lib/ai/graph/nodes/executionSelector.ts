import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphState, model } from "..";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Chooses the best option from the list of options given the current state of the thought process.
 * The AI is given the question, the current state of the thought process, and a list of options to choose from.
 * The AI is then asked to choose the best option to progress the thought process and get closer to a sufficient answer to the question.
 * The output of this node is the best option chosen by the AI.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function executionSelector(state: typeof GraphState.State) {
  console.log("---CHOOSING BEST OPTION---");
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question.
    You will be given a question, the relevant technologies to the question, the current state of the thought process, and a list of options to choose from.
    Choose the best option to progress the thought process and get closer to a sufficient answer to the question.

    Here is the question:
    <question>
    {question}
    </question>

    Here is the current state of the thought process:
    <context>
    {context}
    </context>

    Here are the list of options:
    <options>
    {options}
    </options>
    
    Choose the best option. In your choice, include the contents of the whole option. Do not add any preamble or explanation.`
  );

  const chain = prompt.pipe(model.pipe(new StringOutputParser()));

  const context = await chain.invoke({
    question: state.question,
    context: state.context,
    options: state.options,
  });

  const options = "";

  console.log(context);
  const traceback = "---CHOOSING BEST OPTION---\n" + context + "\n";

  return {
    context,
    options,
    traceback,
  };
}
