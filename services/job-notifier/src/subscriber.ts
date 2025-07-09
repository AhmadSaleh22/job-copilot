import { PubSub } from '@google-cloud/pubsub';
import { JobMatchedEvent } from '../../../libs/domain-events/src/events/JobMatchedEvent';

export type JobStore = Map<string, JobMatchedEvent[]>;

const pubsub = new PubSub();

export function listenForJobMatchedEvents(store: JobStore) {
  const subscription = pubsub.subscription('job-matched-sub');

  subscription.on('message', message => {
    const data = JSON.parse(message.data.toString()) as JobMatchedEvent;
    const list = store.get(data.userId) || [];
    list.push(data);
    store.set(data.userId, list);
    console.log('[JobMatchedEvent] stored for user', data.userId);
    message.ack();
  });
}
