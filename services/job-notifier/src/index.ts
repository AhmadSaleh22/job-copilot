import 'dotenv/config';
import cron from 'node-cron';
import { listenForJobMatchedEvents, JobStore } from './subscriber';
import { generateCoverLetter } from './coverLetter';
import { sendEmail } from './email';

const store: JobStore = new Map();
listenForJobMatchedEvents(store);

cron.schedule('0 8 * * *', async () => {
  for (const [userId, events] of store.entries()) {
    if (events.length === 0) continue;
    const latest = events[events.length - 1];
    const letter = await generateCoverLetter(latest);
    const jobList = latest.jobs.map(j => `<li><a href="${j.url}">${j.title}</a> at ${j.company}</li>`).join('');
    await sendEmail({
      to: latest.email,
      subject: 'Daily Job Matches',
      html: `<p>Here are your matched jobs:</p><ul>${jobList}</ul><p>${letter}</p>`
    });
    store.set(userId, []);
  }
});

console.log('Job notifier running...');
