import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
