const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const gradeSchema = z.object({
  student_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  class_id: z.string().uuid(),
  score: z.number().min(0).max(100),
  comments: z.string().optional(),
});

// Create grade (Admin/Teacher)
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(gradeSchema),
  auditLog('grade', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('grades')
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

// Get grades (filtered by role)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('grades').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update grade (Admin/Teacher)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(gradeSchema),
  auditLog('grade', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('grades')
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

// Delete grade (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('grade', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', req.params.id);
    if (error) {
      req.log.error(error);
      return res.status(400).json({ error: error.message });
    }
    res.status(204).send();
  }
);

// Get report card (by student ID)
router.get('/report/:student_id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('grades')
    .select('subject_id, score, comments, subjects(name)')
    .eq('student_id', req.params.student_id);
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

module.exports = router;
