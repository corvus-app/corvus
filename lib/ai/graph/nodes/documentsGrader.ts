import { GraphState, jsonModel } from "..";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DocumentInterface } from "@langchain/core/documents";
import { JsonOutputParser } from "@langchain/core/output_parsers";

/**
 * Determines whether the retrieved documents are relevant to the question.
 *
 * @param {typeof GraphState.State} state The current state of the graph.
 * @returns {Promise<Partial<typeof GraphState.State>>} The new state object.
 */
export async function documentsGrader(
  state: typeof GraphState.State
): Promise<Partial<typeof GraphState.State>> {
  console.log("---CHECK RELEVANCE---");

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a grader assessing relevance of a retrieved document to a user question.
    Here is the retrieved document:
    
    <document>
    {content}
    </document>
    
    Here is the user question:
    <question>
    {question}
    </question>
    
    If the document contains keywords related to the user question, grade it as relevant.
    It does not need to be a stringent test. The goal is to filter out erroneous retrievals.
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.
    Provide the binary score as a JSON with a single key 'score' and no preamble or explanation.`
  );

  const chain = prompt.pipe(jsonModel).pipe(new JsonOutputParser());

  const relevantDocs: Array<DocumentInterface> = [];
  for await (const doc of state.documents) {
    const grade: { score: string } = await chain.invoke({
      content: doc.pageContent,
      question: state.question,
    });
    if (grade.score === "yes") {
      console.log("---GRADE: DOCUMENT RELEVANT---");
      relevantDocs.push(doc);
    } else {
      console.log("---GRADE: DOCUMENT NOT RELEVANT---");
    }
  }

  return {
    documents: relevantDocs,
  };
}
