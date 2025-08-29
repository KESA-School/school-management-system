const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const timetableSchema = z.object({
  class_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  start_time: z.string(),
  end_time: z.string(),
});

// Create timetable entry (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validate(timetableSchema),
  auditLog('timetable', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('timetables')
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

// Get all timetable entries (Admins) or filtered by role (Teachers/Students)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('timetables').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Get timetable entry by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('timetables')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update timetable entry (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validate(timetableSchema),
  auditLog('timetable', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('timetables')
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

// Delete timetable entry (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('timetable', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('timetables')
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
