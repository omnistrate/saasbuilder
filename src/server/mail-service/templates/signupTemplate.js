function getSignUpMailContent(signUpEventObj) {
  // orgID = signUpEventObj.orgID;
  const email = signUpEventObj.userEmail;

  // [username, provider] = email.split("@");
  //const encodedEmail = encodeURIComponent(username + `+${orgID}@` + provider);
  const activationURL = encodeURI(
    `${
      process.env.YOUR_SAAS_DOMAIN_URL
    }/validate-token?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(signUpEventObj.eventPayload.token)}`
  );

  const subject = `Action Required: Please activate your ${signUpEventObj.orgName} account now`;

  const message = `
    <html>
        <body>
            <p>Hello,</p>
            <p>Thanks for signing up. We're excited to have you onboard.</p>
            <p>To begin using the service, please activate your account by clicking <a href="${activationURL}">here</a>.</p>
            <p>Thanks,</p>
            <p>${signUpEventObj.orgName} Team</p>
        </body>
    </html>`;

  return {
    recepientEmail: signUpEventObj.userEmail,
    subject: subject,
    message: message,
    senderName: signUpEventObj.orgName,
  };
}

module.exports = {
  getSignUpMailContent,
};
