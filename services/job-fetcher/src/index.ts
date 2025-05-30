import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { swaggerSpec } from './swagger';
import swaggerUi from 'swagger-ui-express';

import jobsRoutes from './routes/jobs';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/jobs', jobsRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'job-fetcher ok' });
  });
  
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Job Fetcher running at http://localhost:${PORT}`);
});
