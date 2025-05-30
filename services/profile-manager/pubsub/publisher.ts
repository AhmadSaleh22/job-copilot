// File: pubsub/publisher.ts
import { PubSub } from '@google-cloud/pubsub';
import { CvUploadedEvent } from '../../../libs/domain-events/src/events/CvUploadedEvent';

const pubsub = new PubSub();

export async function publishCvUploaded(event: CvUploadedEvent): Promise<void> {
  const dataBuffer = Buffer.from(JSON.stringify(event));
  await pubsub.topic('cv-uploaded').publish(dataBuffer);
  console.log('[PubSub] CvUploadedEvent published:', event); 
}
