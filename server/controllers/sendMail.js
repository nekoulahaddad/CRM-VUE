const nodemailer = require('nodemailer');
require('dotenv').config();
const calltouch = require('../utils/calltouch');

/**
 * req.body = {
 *
 *  to: 'recipientEmail',
 *  fromSite: 'senderEmail',
 *  clientName: 'clientName'
 *  formatted: 'formatted text'
 *  sendText: boolean
 * }
 */

exports.sendMail = async (req, res, next) => {
  try {
    try {
      calltouch
        .sendFormData({
          fio: `${req.body.clientName}`,
          phoneNumber: `${req.body.clientPhone}`,
          email: `${req.body.clientEmail}`,
          subject: `${req.body.body}`,
          tags: `feedback`,
          requestUrl: `${req.body?.fromSite}`,
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log('🚀 ~ file: sendMail.js ~ line 31 ~ exports.sendMail= ~ error', error);
    }
    const transporter = nodemailer.createTransport({
      port: parseInt(req.body.EMAIL_PORT || process.env.EMAIL_PORT),
      host: `${req.body.EMAIL_HOST || process.env.EMAIL_HOST}`,
      auth: {
        user: `${req.body.EMAIL_SENDER || process.env.EMAIL_SENDER}`,
        pass: `${req.body.EMAIL_SENDER_PASS || process.env.EMAIL_SENDER_PASS}`,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    let html = `<h1>Вы получили обращение от клиента ${req.body.clientName} с сайта ${req.body.fromSite}</h1><h2>Информация о клиенте</h2><ul><li>Имя: ${req.body.clientName}</li><li>Телефон: ${req.body.clientPhone}</li><li>Email: ${req.body.clientEmail}</li></ul><h2>Текст обращения</h2><p>${req.body.body}</p> `;

    let text = `${JSON.stringify(req.body)}`;

    const mailData = {
      from: `${req.body.EMAIL_SENDER || process.env.EMAIL_SENDER}`,
      to: `${req.body.to}`,
      subject: `Новое сообщение от ${req.body.clientName}`,
      text: text,
      html: html,
    };
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        res.status(500).json({ ok: false });
      } else {
        res.status(200).json({ ok: true });
      }
    });
  } catch (error) {
    next(error);
  }
};
