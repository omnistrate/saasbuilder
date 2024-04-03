const getMailProviderConfig = () => {

  if (process.env.MAIL_PROVIDER === 'custom') {

    if (!process.env.MAIL_SMTP_HOST || !process.env.MAIL_SMTP_PORT) {
      throw new Error('Missing MAIL_SMTP_HOST and/or MAIL_SMTP_PORT environment variables for custom mail provider.')
    }

    return {
      service: process.env.MAIL_SMTP_SERVICE || 'custom',
      host: process.env.MAIL_SMTP_HOST,
      port: process.env.MAIL_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER_EMAIL,
        pass: process.env.MAIL_USER_PASSWORD,
      }
    }
  }

  return {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASSWORD,
    },
  }
}

exports.getMailProviderConfig = getMailProviderConfig;