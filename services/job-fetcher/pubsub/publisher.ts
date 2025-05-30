import { PubSub } from '@google-cloud/pubsub';
const pubsub = new PubSub();

export async function publishJobMatchedEvent(data: any) {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  await pubsub.topic('job-matched').publish(dataBuffer);
}