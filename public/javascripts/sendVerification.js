const sgMail = require('@sendgrid/mail')
module.exports.sendEmail = (user) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const code = Math.floor(Math.random()*900) + 100;
    user.verificationCode = code;
    user.save();
    const msg = {
      to: user.email, // Change to your recipient
      from: 'admin@communitylibrary.co', // Change to your verified sender
      subject: 'Please verify your email.',
      text: `Your verification code is ${code}`,
      html: `<strong>Your verification code is ${code}</strong>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}

