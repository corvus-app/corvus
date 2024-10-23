"use server";

import { app } from ".";

export async function callAI(input: string) {
  const inputs = {
    question: input,
  };
  const config = { recursionLimit: 20 };

  let answer = "";
  let tracebacks = "";

  try {
    for await (const output of await app.stream(inputs, config)) {
      const key = Object.keys(output)[0];
      const value = output[key];
      tracebacks += value.traceback + "\n";
      if (key === "generateAnswer") {
        answer = value.answer;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return {
    output: answer,
    tracebacks: tracebacks,
  };
}
