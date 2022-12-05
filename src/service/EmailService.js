const EmailFactory = require('../factory/EmailFactory');
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

sendMail = function ({ to, subject, html }) {
  const correctHtml = EmailFactory.generate(html, subject);
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to,
    subject,
    text: html,
    html: correctHtml,
  };

  sendgridMail.send(msg)
    .then(() => { console.log('  - Email sent to', to); })
    .catch(_err => { throw _err; });
};

sendVerifyEmailMail = function ({ to, token }) {
  const link = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <h1>Thanks for signin up to AudioLibrary!</h1>
    <h2>Confirm this is you by verifying your email address</h2>
    <a href="${link}">Click here to activate your account</a>
    <p>Or copy this into your browser:</p>
    <p>${link}</p>
  `;
  sendMail({ to, html, subject: 'AudioLibrary | Verify your email address' });
};

module.exports = {
  sendMail,
  sendVerifyEmailMail
};