"use server";

import { producer } from "./producer";

export async function produceEvent(topic, data) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(data) }],
  });
  console.log("Data sent to Kafka: ", data);
}
