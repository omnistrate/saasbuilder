function getOrgRevokeUserMailContent(revokeUserEventObj) {
  const userName = revokeUserEventObj.eventPayload.inviting_user_name;
  const serviceName = revokeUserEventObj.eventPayload.service_name;

  const subject = `Access revoked for ${userName}'s subscription on ${serviceName} service`;

  const message = `
    <html>
      <body>
        <p>Hello,</p>
        <p>You’ve been removed from ${userName}'s subscription on ${serviceName} service</p>
        <p>If you have any question, please contact the subscription owner</p>
        <p>Thanks</p>
      </body>
    </html>`;

  return {
    recepientEmail: revokeUserEventObj.userEmail,
    subject: subject,
    message: message,
    senderName: revokeUserEventObj.orgName,
  };
}

module.exports = {
  getOrgRevokeUserMailContent,
};
