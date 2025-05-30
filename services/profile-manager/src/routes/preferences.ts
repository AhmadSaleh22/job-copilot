import { Router } from 'express';
import { updateJobPreferences, getJobPreferences } from '../controllers/preferencesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// ✅ Apply JWT authentication middleware
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Preferences
 *   description: Job Preferences Management (requires JWT auth)
 */

/**
 * @swagger
 * /preferences:
 *   post:
 *     summary: Update or create job preferences
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workLocation:
 *                 type: string
 *                 example: Remote
 *               jobTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Fulltime", "Contractor"]
 *               jobTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Frontend Developer", "Fullstack Developer"]
 *               seniority:
 *                 type: string
 *                 example: Senior
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["English"]
 *               includeKeywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["React", "Next.js"]
 *               excludeKeywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Angular", "PHP"]
 *               excludeCompanies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Facebook", "Amazon"]
 *     responses:
 *       200:
 *         description: Preferences saved
 *       401:
 *         description: Unauthorized
 */
router.post('/', updateJobPreferences);

/**
 * @swagger
 * /preferences:
 *   get:
 *     summary: Get the current user's job preferences
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Preferences not found
 */
router.get('/', getJobPreferences);

export default router;
