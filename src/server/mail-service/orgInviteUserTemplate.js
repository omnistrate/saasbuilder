function getOrgInviteUserMailContent(inviteUserEventObj) {
  const signUpURL = encodeURI(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/signup?org=${encodeURIComponent(
      inviteUserEventObj.orgName
    )}&orgUrl=${encodeURI(
      inviteUserEventObj.orgURL
    )}&email=${encodeURIComponent(inviteUserEventObj.userEmail)}`
  );
  const signInURL = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/signin`;

  const userName = inviteUserEventObj.eventPayload.inviting_user_name;
  const serviceName = inviteUserEventObj.eventPayload.service_name;

  const subject = `Invitation to join ${userName}'s subscription on ${serviceName} service`;

  let message = ``;
  if (inviteUserEventObj.eventPayload.is_user_enabled) {
    message = `
  <html>
    <body>
      <p>Hello,</p>
      <p>You've been invited to join ${userName}'s subscription on ${serviceName} service.</p>
      <p>Please login to your account ${signInURL} to accept the invitationn</p>
      <p>Thanks</p>
    </body>
  </html>`;
  } else {
    message = `
  <html>
    <body>
      <p>Hello,</p>
      <p>You've been invited to join ${userName}'s subscription on ${serviceName} service.</p>
      <p>Create your account <a href="${signUpURL}">here</a> to accept the invitation</p>
      <p>Thanks</p>
    </body>
  </html>`;
  }

  return {
    recepientEmail: inviteUserEventObj.userEmail,
    subject: subject,
    message: message,
    senderName: inviteUserEventObj.orgName,
  };
}

module.exports = {
  getOrgInviteUserMailContent,
};
