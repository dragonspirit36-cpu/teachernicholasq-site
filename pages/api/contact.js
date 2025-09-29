import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server email configuration missing' });
  }

  try {
    const result = await resend.emails.send({
      from: 'Teacher Nicholas Q <contact@teachernicholasq.com>',
      to: 'teachernicholasq@gmail.com',
      reply_to: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      `,
    });

    if (!result?.data?.id) {
      return res.status(502).json({ error: 'Email service did not return an id' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    const msg = err?.message || 'Failed to send email';
    return res.status(500).json({ error: msg });
  }
}
