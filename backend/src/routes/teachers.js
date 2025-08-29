const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const teacherSchema = z.object({
  user_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  subject_id: z.string().uuid().optional(),
});

// Create teacher (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validate(teacherSchema),
  auditLog('teacher', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('teachers')
      .insert(req.body)
      .select()
      .single();
    if (error) {
      req.log.error(error);
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  }
);

// Get all teachers (Admins) or filtered by role (Teachers)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('teachers').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Get teacher by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update teacher (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validate(teacherSchema),
  auditLog('teacher', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('teachers')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) {
      req.log.error(error);
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  }
);

// Delete teacher (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('teacher', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', req.params.id);
    if (error) {
      req.log.error(error);
      return res.status(400).json({ error: error.message });
    }
    res.status(204).send();
  }
);

module.exports = router;
