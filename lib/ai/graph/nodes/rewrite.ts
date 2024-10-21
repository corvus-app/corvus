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
    `You are a question re-writer that converts an input question to a better version that is optimized
    for vectorstore retrieval. Look at the initial and formulate an improved question.
    
    Here is the initial question:
    
    <question>
    {question}
    </question>
    
    Respond only with an improved question. Do not include any preamble or explanation.`
  );

  // Construct the chain
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const betterQuestion = await chain.invoke({ question: state.question });

  return {
    question: betterQuestion,
  };
}
