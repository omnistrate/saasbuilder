function getResetPasswordMailContent(resetPasswordEventObj) {
  const orgName = resetPasswordEventObj.orgName;
  const email = resetPasswordEventObj.userEmail;
  const token = resetPasswordEventObj.eventPayload.token;

  const resetPasswordPageURL = encodeURI(
    `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/change-password?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`
  );

  const subject = `Reset Password request for your ${orgName} account`;

  const message = `
      <html>
          <body>
              <p>Hello,</p>
              <p>To reset your password, please click here <a href="${resetPasswordPageURL}">here</a></p>
              <p>Thanks</p>
          </body>
      </html>`;

  const recepientEmail = resetPasswordEventObj.userEmail;

  let mailContent = null;
  if (orgName && email && token && recepientEmail) {
    mailContent = {
      recepientEmail: recepientEmail,
      subject: subject,
      message: message,
      senderName: orgName,
    };
  }

  return mailContent;
}

module.exports = {
  getResetPasswordMailContent,
};
