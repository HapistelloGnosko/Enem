import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index';
import { JWT_SECRET_KEY } from '../middleware/auth';
import { xpProgress } from '../services/xpService';

const router = Router();

// Registro
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'A senha deve conter ao menos 4 dígitos.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(normalizedEmail);

    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado. Faça login.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = db.createUser(name.trim(), normalizedEmail, passwordHash);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '30d' });
    const progress = xpProgress(user.xp);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        ...progress,
      },
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '30d' });
    const progress = xpProgress(user.xp);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        ...progress,
      },
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: 'Erro ao processar login.' });
  }
});

export default router;
