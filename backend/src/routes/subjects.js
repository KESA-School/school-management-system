const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const subjectSchema = z.object({
  name: z.string().min(1),
});

// Create subject (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  validate(subjectSchema),
  auditLog('subject', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('subjects')
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

// Get all subjects (Authenticated users)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('subjects').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Get subject by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Update subject (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  validate(subjectSchema),
  auditLog('subject', 'update'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('subjects')
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

// Delete subject (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('subject', 'delete'),
  async (req, res) => {
    const { error } = await supabase
      .from('subjects')
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
