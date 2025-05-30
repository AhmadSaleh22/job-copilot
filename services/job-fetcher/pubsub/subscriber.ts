// services/profile-manager/pubsub/subscriber.ts
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();

export function listenForCvUploadedEvents() {
  const subscription = pubsub.subscription('cv-uploaded-sub');

  subscription.on('message', message => {
    const data = JSON.parse(message.data.toString());
    console.log('[CV Uploaded Event]', data);
    message.ack();
  });
}
