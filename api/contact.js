// Serverless function that uses Resend REST API via fetch (no NPM deps).
// Requires Vercel env var: RESEND_API_KEY (set for Production).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const text = `From: ${name} <${email}>\n\n${message}`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',          // allowed on free tier
        to: ['teachernicholasq@gmail.com'],
        subject: `Website inquiry from ${name}`,
        text,
        reply_to: email
      })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = data?.message || data?.error || 'Failed to send message.';
      return res.status(500).json({ error: msg });
    }

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
