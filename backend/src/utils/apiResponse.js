

function success(data = null, meta = null) {
  const payload = { success: true };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return payload;
}

function error(message = "Server error", code = 500, details = null) {
  const payload = { success: false, error: { message, code } };
  if (details) payload.error.details = details;
  return payload;
}

module.exports = { success, error };
