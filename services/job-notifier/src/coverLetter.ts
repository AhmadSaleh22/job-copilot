import { OpenAI } from 'openai';
import { JobMatchedEvent } from '../../../libs/domain-events/src/events/JobMatchedEvent';

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateCoverLetter(event: JobMatchedEvent): Promise<string> {
  const job = event.jobs[0];
  const prompt = `Write a short cover letter for a job application.\nJob title: ${job.title}\nCompany: ${job.company}`;
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });
  return completion.choices[0]?.message?.content || '';
}
