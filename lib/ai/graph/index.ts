import { END, START, StateGraph, Annotation } from "@langchain/langgraph/web";
import { Document } from "@langchain/core/documents";

import { ChatGroq } from "@langchain/groq";

import { subGoalSelector } from "./edges/subGoalSelector";
import { reason } from "./nodes/reason";
import { executionSelector } from "./nodes/executionSelector";
import { generateRelevantDependencies } from "./nodes/generateRelevantDependencies";
import { retrieve } from "./nodes/retrieve";
import { queryAnalysis } from "./edges/queryAnalysis";
import { genQuery } from "./nodes/genQuery";
import { generateAnswer } from "./nodes/generateAnswer";
import { unrelatedQuestion } from "./tracebackNodes/unrelatedQuestion";
import { answerAndHallucinationsGrader } from "./edges/answerAndHallucinationGrader";
import { rewriteQuery } from "./nodes/rewrite";
import { answeredQuestion } from "./tracebackNodes/answeredQuestion";

export const model = new ChatGroq({
  model: "llama-3.2-90b-text-preview",
  temperature: 0,
});

// Paper mentions to use 0.7 temperature for generating rationales
export const rationaleModel = new ChatGroq({
  model: "llama-3.2-90b-text-preview",
  temperature: 0.7,
});

export const jsonModel = new ChatGroq({
  model: "llama-3.1-70b-versatile",
  temperature: 0,
}).bind({ response_format: { type: "json_object" } });

export const summarizerModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

// Returned context from a node will be appended to the current "context" value in the state object.
// Returned options from a node will override the current "options" value in the state object.
// Returned documents from a node will override the current "documents" value in the state object.
// Returned traceback from a node will be appended to the current "traceback" value in the state object.
export const GraphState = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<string>({
    reducer: (x, y) => x + "\n" + y,
    default: () => "",
  }),
  technologies: Annotation<string>,
  answer: Annotation<string>,
  options: Annotation<string>({
    reducer: (_, y) => y,
    default: () => "",
  }),
  documents: Annotation<Document[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  traceback: Annotation<string>({
    reducer: (x, y) => x + "\n" + y,
    default: () => "",
  }),
});

const workflow = new StateGraph(GraphState)
  .addNode("generateRelevantDependencies", generateRelevantDependencies)
  .addNode("unrelatedQuestion", unrelatedQuestion)
  .addNode("retrieve", retrieve)
  .addNode("executionSelector", executionSelector)
  .addNode("generateAnswer", generateAnswer)
  .addNode("answeredQuestion", answeredQuestion)
  .addNode("rewrite", rewriteQuery)
  .addNode("reason", reason)
  .addNode("genQuery", genQuery);

workflow.addConditionalEdges(START, queryAnalysis, {
  related: "generateRelevantDependencies",
  not_related: "unrelatedQuestion",
});
workflow.addEdge("generateRelevantDependencies", "retrieve");
workflow.addEdge("retrieve", "executionSelector");
workflow.addEdge("executionSelector", "generateAnswer");
workflow.addConditionalEdges("generateAnswer", answerAndHallucinationsGrader, {
  useful: "answeredQuestion",
  not_useful: "rewrite",
  not_supported: "rewrite",
});
workflow.addEdge("answeredQuestion", END);
workflow.addConditionalEdges("rewrite", subGoalSelector, {
  reason: "reason",
  retrieve: "retrieve",
  genQuery: "genQuery",
});
workflow.addEdge("reason", "executionSelector");
workflow.addEdge("genQuery", "executionSelector");

export const app = workflow.compile();
