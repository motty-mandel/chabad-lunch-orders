require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendOrderEmail(order) {
  const { customerName, customerEmail, items, total, specialRequests } = order;

  const itemList = items.map(i => `${i.day} - ${i.name} x${i.qty}`).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Order from ${customerName}`,
    text: `
Customer Name: ${customerName}
Customer Email: ${customerEmail}

Order:
${itemList}

Total: $${total}

Special Requests:
${specialRequests}
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendOrderEmail;
