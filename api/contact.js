// api/contact.js
// Fonction Vercel — réception du formulaire de devis DOCIG
// Utilise les variables d'environnement déjà configurées sur le projet eldex-partners :
//   GMAIL_USER, GMAIL_APP_PASSWORD
// Aucune credential ne doit jamais être écrite en dur dans ce fichier.

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { nom, tel, email, projet, message } = req.body || {};

  if (!nom || !tel || !email || !projet) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Nouvelle demande de devis — DOCIG (${projet})`,
      text: [
        `Nom : ${nom}`,
        `Téléphone : ${tel}`,
        `Email : ${email}`,
        `Type de projet : ${projet}`,
        `Message : ${message || '(non renseigné)'}`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact_form_error', err);
    return res.status(500).json({ error: 'send_failed' });
  }
};
