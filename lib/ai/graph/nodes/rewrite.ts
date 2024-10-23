import { GraphState, model } from "..";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * Transform the query to produce a better question.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function rewriteQuery(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---REWRITE QUERY---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a thought within a chain of thoughts designed to mention relevant links, GitHub commits and documents that should help with the question. 
    You have expertise in rewriting questions to a better version that is optimized for web search. 
    You will be given a question, the relevant technologies to the question, and the current state of the thought process.
    Based on the relevant technologies and the current state of the thought process, rewrite the question to a better version that is optimized for web search.

    Here are the relevant technologies:
    <technologies>
    {technologies}
    </technologies>

    Here is the current state of the thought process:
    <context>
    {context}
    </context>

    Here is the question:
    <question>
    {question}
    </question>
    
    Respond only with an improved question. Do not include any preamble or explanation.`
  );

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const question = await chain.invoke({
    technologies: state.technologies,
    context: state.context,
    question: state.question,
  });

  console.log(question);
  const traceback =
    "---HALLUCINATION AND ANSWER GRADER---\n" +
    "---DECISION: ANSWER DOES NOT RESOLVE QUESTION---\n" +
    "---REWRITE QUERY---\n" +
    state.question +
    "\n";

  return {
    question,
    traceback,
  };
}
