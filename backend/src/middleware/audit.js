const supabase = require('../config/supabase');

const auditLog = (entity, action) => async (req, res, next) => {
  const originalSend = res.send;
  res.send = async function (body) {
    if (res.statusCode < 400) {
      const { error } = await supabase.from('audit_logs').insert({
        user_id: req.user.id,
        action,
        entity,
        entity_id: req.params.id || body?.id,
        details: req.body,
      });
      if (error) req.log.error(error);
    }
    originalSend.call(this, body);
  };
  next();
};

module.exports = auditLog;
