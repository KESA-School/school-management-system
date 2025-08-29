const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const auditLog = require('../middleware/audit');
const validate = require('../utils/validate');
const router = express.Router();

const announcementSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  created_by: z.string().uuid(),
});

// Create announcement (Admin/Teacher)
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(announcementSchema),
  auditLog('announcement', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('announcements')
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

// Get announcements (All authenticated users)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('announcements').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update announcement (Admin/Teacher)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(announcementSchema),
  auditLog('announcement', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('announcements')
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

// Delete announcement (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('announcement', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('announcements')
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
