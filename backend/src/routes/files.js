const express = require('express');
const supabase = require('../config/supabase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { z } = require('zod');
const validate = require('../utils/validate');
const auditLog = require('../middleware/audit');
const router = express.Router();

const fileSchema = z.object({
  name: z.string().min(1).max(100),
  path: z.string().min(1),
  uploaded_by: z.string().uuid(),
  student_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),
  type: z.enum(['assignment', 'document']),
});

// Upload file metadata (Admin/Teacher)
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'teacher']),
  validate(fileSchema),
  auditLog('file', 'create'),
  async (req, res) => {
    const { data, error } = await supabase
      .from('files')
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

// Get files (filtered by role)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('files').select('*');
  if (error) {
    req.log.error(error);
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Delete file metadata and storage object (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  auditLog('file', 'delete'),
  async (req, res) => {
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('path')
      .eq('id', req.params.id)
      .single();
    if (fileError) {
      req.log.error(fileError);
      return res.status(400).json({ error: fileError.message });
    }

    const { error: storageError } = await supabase.storage
      .from('school-files')
      .remove([file.path]);
    if (storageError) {
      req.log.error(storageError);
      return res.status(400).json({ error: storageError.message });
    }

    const { error } = await supabase
      .from('files')
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
