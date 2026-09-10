import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import questionRoutes from './routes/questions';
import attemptRoutes from './routes/attempts';
import statsRoutes from './routes/stats';
import dailyRoutes from './routes/daily';
import gamificationRoutes from './routes/gamification';
import codexRoutes from './routes/codex';
import reviewsRoutes from './routes/reviews';
import coachRoutes from './routes/coach';
import libraryRoutes from './routes/library';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/codex', codexRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/library', libraryRoutes);

// Healthcheck
app.get('/health', (_, res) => {
  res.json({ status: 'ok', app: 'ENEM Quest API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`🎓 ENEM QUEST - BACKEND EXECUTANDO`);
  console.log(`   Porta: http://localhost:${PORT}`);
  console.log(`   Healthcheck: http://localhost:${PORT}/health`);
  console.log(`==============================================\n`);
});
