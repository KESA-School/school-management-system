const express = require('express');
const supabase = require('../config/supabase');
const validate = require('../utils/validate');
const { z } = require('zod');
const router = express.Router();

// Schema for registration
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'teacher', 'student', 'parent']),
});

// Register user
router.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Insert user role into users table
    await supabase.from('users').insert({ id: data.user.id, role });
    res.status(201).json({ user: data.user, role });
  } catch (error) {
    req.log.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post(
  '/login',
  validate(z.object({ email: z.string().email(), password: z.string() })),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Fetch user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (userError) throw userError;

      res.json({ user: data.user, role: userData.role, session: data.session });
    } catch (error) {
      req.log.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Google OAuth (optional)
router.get('/google', async (req, res) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'http://localhost:5173/auth/callback' },
  });
  if (error) return res.status(400).json({ error: error.message });
  res.redirect(data.url);
});

// Logout
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Logged out' });
});

module.exports = router;
