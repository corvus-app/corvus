"use server";

import { app } from ".";

export async function testRAG(input: string) {
  const inputs = {
    question: input,
  };
  const config = { recursionLimit: 5 };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prettifyOutput = (output: Record<string, any>) => {
    const key = Object.keys(output)[0];
    const value = output[key];
    console.log(`Node: '${key}'`);
    if (key === "retrieve" && "documents" in value) {
      console.log(`Retrieved ${value.documents.length} documents.`);
    } else if (key === "gradeDocuments" && "documents" in value) {
      console.log(
        `Graded documents. Found ${value.documents.length} relevant document(s).`
      );
    } else {
      console.dir(value, { depth: null });
    }
  };

  for await (const output of await app.stream(inputs, config)) {
    prettifyOutput(output);
    console.log("\n---ITERATION END---\n");
  }
}
