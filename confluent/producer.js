import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.CONFLUENT_CLIENT_ID,
  brokers: [process.env.CONFLUENT_BROKER_URL],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.CONFLUENT_API_KEY,
    password: process.env.CONFLUENT_API_SECRET,
  },
});

export const producer = kafka.producer();
