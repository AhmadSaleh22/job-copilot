import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { fetchUserPreferences } from '../utils/fetchPreferences';
import { fetchRemoteOkJobs } from '../sources/remoteok';
import { matchJobs } from '../utils/matchJobs';

const router = Router();

/**
 * @swagger
 * /jobs/preview:
 *   get:
 *     summary: Get a preview list of matched jobs from RemoteOK
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top 20 matched jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: ahmad@example.com
 *                 preferences:
 *                   type: object
 *                   description: The user's saved job preferences
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123456"
 *                       title:
 *                         type: string
 *                         example: "Frontend Developer"
 *                       company:
 *                         type: string
 *                         example: "Remote Co"
 *                       location:
 *                         type: string
 *                         example: "Remote"
 *                       url:
 *                         type: string
 *                         example: "https://remoteok.com/remote-jobs/123456"
 *                       description:
 *                         type: string
 *                         example: "React developer role working on modern web apps"
 *                       source:
 *                         type: string
 *                         example: "RemoteOK"
 *                       matchScore:
 *                         type: number
 *                         example: 85
 */
router.get('/preview', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || !req.headers.authorization) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = req.headers.authorization.split(' ')[1];
  const preferences = await fetchUserPreferences(req.user.id, token);

  if (!preferences) {
    res.status(404).json({ error: 'Preferences not found' });
    return;
  }

  // Fetch real jobs from RemoteOK
  const remoteOkJobs = await fetchRemoteOkJobs();

  // Apply scoring and filtering
  const matchedJobs = matchJobs(remoteOkJobs, preferences);

  res.json({
    user: req.user.email,
    preferences,
    jobs: matchedJobs.slice(0, 20) // top 20
  });
});

export default router;
