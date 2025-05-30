import { Request, Response } from 'express';
import { prisma } from '../models/useModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';


export async function updateJobPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const data = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const existing = await prisma.jobPreferences.findUnique({ where: { userId } });

  if (existing) {
    await prisma.jobPreferences.update({
      where: { userId },
      data,
    });
  } else {
    await prisma.jobPreferences.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  res.status(200).json({ message: 'Preferences saved' });
}

export async function getJobPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const preferences = await prisma.jobPreferences.findUnique({ where: { userId } });

  if (!preferences) {
    res.status(404).json({ error: 'Preferences not found' });
    return;
  }

  res.status(200).json(preferences);
}
