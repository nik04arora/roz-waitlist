function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function normalizeIndianPhone(value) {
  var raw = String(value || '').trim();
  var digits = raw.replace(/\D/g, '');

  if (digits.startsWith('0091')) digits = digits.slice(4);
  if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return '+91' + digits;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  var supabaseUrl = process.env.SUPABASE_URL;
  var serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 500, { error: 'Waitlist is not configured yet.' });
  }

  var body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_error) {
      return json(res, 400, { error: 'Invalid request body.' });
    }
  }

  var phone = normalizeIndianPhone(body && body.phone);
  if (!phone) {
    return json(res, 400, {
      error: 'Please enter a valid 10-digit Indian mobile number.'
    });
  }

  var payload = {
    phone: phone,
    country: 'IN',
    source: body && body.source ? String(body.source).slice(0, 80) : 'website',
    user_agent: req.headers['user-agent'] || null
  };

  try {
    var response = await fetch(
      supabaseUrl.replace(/\/$/, '') + '/rest/v1/waitlist',
      {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: 'Bearer ' + serviceRoleKey,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
      }
    );

    var text = await response.text();
    var data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      if (data && data.code === '23505') {
        return json(res, 200, {
          ok: true,
          phone: phone,
          message: "You're already on the waitlist."
        });
      }

      console.error('Supabase waitlist insert failed:', data || text);
      return json(res, 500, {
        error: 'Could not join the waitlist right now. Please try again.'
      });
    }

    return json(res, 200, {
      ok: true,
      phone: phone,
      message: "You're in. We'll text you when early access opens."
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return json(res, 500, {
      error: 'Could not join the waitlist right now. Please try again.'
    });
  }
};
