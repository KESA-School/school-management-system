const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ error: 'No token provided' });

  const { data, error } = await supabase.auth.getUser(
    authorization.replace('Bearer ', '')
  );
  if (error) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;
  next();
};

const requireRole = (roles) => async (req, res, next) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', req.user.id)
    .single();
  if (error || !roles.includes(data.role)) {
    return res.status(403).json({ error: 'Unauthorized role' });
  }
  req.user.role = data.role;
  next();
};

module.exports = { requireAuth, requireRole };
