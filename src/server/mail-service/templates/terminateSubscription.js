function getSubscriptionTerminateMailContent(terminateSubsriptionEventObj) {
  const orgName = terminateSubsriptionEventObj.orgName;
  const email = terminateSubsriptionEventObj.userEmail;
  const serviceName = terminateSubsriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    terminateSubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription terminated`;

  const message = `
              <html>
                  <body>
                      <p>Hello,</p>
                      <p>Your ${servicePlanName} subscription on ${serviceName} has been terminated. You will no longer have access to the plan's features.  If you believe this was in error, please contact support.</p>
                      <p>If you have any questions, please contact support.</p>
                      <p>Sincerely,</p>
                      <p>The ${serviceName} Team</p>
                  </body>
              </html>`;

  const recepientEmail = email;

  let mailContent = null;
  if (orgName && serviceName && servicePlanName && recepientEmail) {
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
  getSubscriptionTerminateMailContent,
};
