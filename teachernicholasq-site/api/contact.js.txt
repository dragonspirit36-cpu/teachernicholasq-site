import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'teachernicholasq@gmail.com',
      subject: `Website inquiry from ${name}`,
      reply_to: email,
      text: message,
    });

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}