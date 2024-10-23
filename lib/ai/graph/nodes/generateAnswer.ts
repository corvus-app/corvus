import { GraphState, model } from "..";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Generates an answer to the question given the current state of the thought process.
 *
 * This node is given the question, the relevant technologies to the question, and the current state of the thought process.
 * The node is then asked to generate an answer to the question by pointing out relevant links, Github commits, or documents that can be used to answer the question.
 *
 * The output of this node is an answer to the question in one paragraph and the traceback.
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function generateAnswer(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---GENERATE ANSWER---");
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question.. 
    You will be given a question, the relevant technologies to the question, and the current state of the thought process.
    You are tasked with pointing out relevant Github commits or documents in the current state of the thought process that can be used to answer the question.

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

    In one paragraph, only base your guidance on the current state of the thought process. Do not add any preamble or explanation.
    `
  );

  // Construct the RAG chain by piping the prompt, model, and output parser
  const ragChain = prompt.pipe(model).pipe(new StringOutputParser());

  const answer = await ragChain.invoke({
    question: state.question,
    technologies: state.technologies,
    context: state.context,
  });

  console.log(answer);
  const traceback = "---GENERATE ANSWER---\n" + answer + "\n";

  return {
    answer,
    traceback,
  };
}
