const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const studentSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  date_of_birth: z.string().optional(),
  class_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
});

// Create student (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validate(studentSchema),
  auditLog('student', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('students')
      .insert(req.body)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  }
);

// Get all students (Admins) or filtered by role (Teachers/Parents)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('students').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get student by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update student (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validate(studentSchema),
  auditLog('student', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('students')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  }
);

// Delete student (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('student', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  }
);

module.exports = router;
