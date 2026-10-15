const { query } = require('../config/database');

// Log audit events
const logAuditEvent = async (actorId, action, targetType, targetId, details = {}, ipAddress = null) => {
  try {
    await query(
      `INSERT INTO audit_events (actor_id, action, target_type, target_id, details, ip_address) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [actorId, action, targetType, targetId, JSON.stringify(details), ipAddress]
    );
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
};

module.exports = { logAuditEvent };
