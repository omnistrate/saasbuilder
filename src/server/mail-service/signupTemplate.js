function getSignUpMailContent(signUpEventObj) {
  // orgID = signUpEventObj.orgID;
  const email = signUpEventObj.userEmail;

  // [username, provider] = email.split("@");
  //const encodedEmail = encodeURIComponent(username + `+${orgID}@` + provider);
  console.log("Base domain", process.env.YOUR_SAAS_DOMAIN_URL)
  const activationURL = encodeURI(
    `${
      process.env.YOUR_SAAS_DOMAIN_URL
    }/validate-token?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(signUpEventObj.eventPayload.token)}`
  );

  const subject = `Please confirm your ${signUpEventObj.orgName} registration`;

  const message = `
    <html>
        <body>
            <p>Hello,</p>
            <p>Thanks for signing up.</p>
            <p>To activate your account, please click <a href="${activationURL}">here</a> to confirm your registration</p>
            <p>Thanks</p>
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
