import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cvRoutes from './routes/cv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import preferencesRoutes from './routes/preferences';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', cvRoutes);
app.use('/preferences', preferencesRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'profile-manager ok' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Profile Manager running on http://localhost:${PORT}`);
});
