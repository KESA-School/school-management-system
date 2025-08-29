const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const classSchema = z.object({
  name: z.string().min(1),
  teacher_id: z.string().uuid().optional(),
});

// Create class (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validate(classSchema),
  auditLog('class', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('classes')
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

// Get all classes (Admins) or filtered by role (Teachers/Students)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('classes').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Get class by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update class (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validate(classSchema),
  auditLog('class', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('classes')
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

// Delete class (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('class', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('classes')
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
