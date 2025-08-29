const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const attendanceSchema = z.object({
  student_id: z.string().uuid(),
  class_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['present', 'absent', 'late']),
});

// Create attendance record (Admin/Teacher)
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(attendanceSchema),
  auditLog('attendance', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('attendance')
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

// Get attendance records (filtered by role)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('attendance').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update attendance record (Admin/Teacher)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(attendanceSchema),
  auditLog('attendance', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('attendance')
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

// Delete attendance record (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('attendance', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('attendance')
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
