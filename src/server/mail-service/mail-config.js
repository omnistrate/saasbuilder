function getNodeMailerConfig() {
  return {
    host: process.env.MAIL_SMTP_HOST || "smtp.gmail.com",
    port: process.env.MAIL_SMTP_PORT || "587",
    secure: false,
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASSWORD,
    },
  };
}

exports.getNodeMailerConfig = getNodeMailerConfig;
