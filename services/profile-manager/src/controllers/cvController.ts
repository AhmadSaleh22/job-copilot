import { Request, Response } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';
import { prisma } from '../models/useModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { publishCvUploaded } from '../../pubsub/publisher';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:4001', // change if deployed
    'X-Title': 'JobCopilot ATS Parser',
  },
});

export async function handleCvUpload(req: AuthenticatedRequest, res: Response): Promise<void> {
  const file = req.file;
  const userId = req.user?.id;

  if (!file || !userId) {
    res.status(400).json({ error: 'Missing file or user' });
    return;
  }

  try {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfText = (await pdfParse(dataBuffer)).text;

    // 🔥 Publish event
    await publishCvUploaded({
      userId,
      cvText: pdfText,
      timestamp: new Date().toISOString(),
    });

    const prompt = `You are an expert ATS resume reviewer. Analyze this resume:\n\n${pdfText}\n\nReturn a JSON object with:
{
  preferences: {
    jobTitles: string[],
    jobTypes: string[],
    workLocation: string[],
    includeKeywords: string[],
    excludeKeywords: string[],
    excludeCompanies: string[]
  },
  atsScore: number,
  strengths: string[],
  weaknesses: string[],
  keywordsPresent: string[],
  keywordsMissing: string[]
}`;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mixtral-8x7b-instruct',
      messages: [
        { role: 'system', content: 'You are a JSON-only response generator.' },
        { role: 'user', content: prompt }
      ]
    });

    const rawContent = completion.choices[0].message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      console.error('[Parse Error] Raw output was not JSON:', rawContent);
      res.status(502).json({ error: 'AI returned non-JSON format' });
      return;
    }

    await prisma.jobPreferences.upsert({
      where: { userId },
      update: { ...parsed.preferences },
      create: { userId, ...parsed.preferences }
    });

    res.status(200).json({ atsAnalysis: parsed });
  } catch (err: any) {
    console.error('[OpenAI Error]', err.message);
    res.status(500).json({ error: 'OpenRouter quota exceeded or model access failed.' });
  }
}
