import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware';
import { handleCvUpload } from '../controllers/cvController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /cv:
 *   post:
 *     summary: Upload a CV (PDF) and extract preferences and ATS analysis
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF resume file
 *     responses:
 *       200:
 *         description: ATS analysis and extracted preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 atsAnalysis:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       type: object
 *                     atsScore:
 *                       type: number
 *                       example: 85
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: string
 *                     weaknesses:
 *                       type: array
 *                       items:
 *                         type: string
 *                     keywordsPresent:
 *                       type: array
 *                       items:
 *                         type: string
 *                     keywordsMissing:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post('/cv', authenticateToken, upload.single('file'), handleCvUpload);

export default router;
