import { Annotation, START, END } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
import { StateGraph } from "@langchain/langgraph";

import { ChatGroq } from "@langchain/groq";

import { answerableQuestion } from "./edges/answerableQuestion";
import { decideToGenerate } from "./edges/decideToGenerate";
import { generate } from "./nodes/generate";
import { documentsGrader } from "./nodes/documentsGrader";
import { retrieve } from "./nodes/retrieve";
import { rewriteQuery } from "./nodes/rewrite";
import { gradeHallucinationsAndUsefulness } from "./edges/gradeHallucinationsAndUsefulness";

export const model = new ChatGroq({
  model: "llama-3.1-70b-versatile", // use more powerful model in production: llama-3.2-90b-text-preview
  temperature: 0,
});

export const jsonModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
}).bind({ response_format: { type: "json_object" } });

// This defines the agent state.
// Returned documents from a node will override the current
// "documents" value in the state object.
export const GraphState = Annotation.Root({
  question: Annotation<string>,
  generation: Annotation<string>,
  documents: Annotation<Document[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
});

// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes
  .addNode("retrieve", retrieve)
  .addNode("documentsGrader", documentsGrader)
  .addNode("generate", generate)
  .addNode("rewriteQuery", rewriteQuery);

// Build graph
workflow.addConditionalEdges(START, answerableQuestion, {
  answerable: "retrieve",
  not_answerable: END,
});
workflow.addEdge("retrieve", "documentsGrader");
workflow.addConditionalEdges("documentsGrader", decideToGenerate, {
  rewriteQuery: "rewriteQuery",
  generate: "generate",
});
workflow.addEdge("rewriteQuery", "retrieve");
workflow.addConditionalEdges("generate", gradeHallucinationsAndUsefulness, {
  not_supported: "rewriteQuery",
  useful: END,
  not_useful: "rewriteQuery",
});

// Compile
export const app = workflow.compile();
