function getSubscriptionSuspendedMailContent(suspendSubscriptionEventObj) {
  const orgName = suspendSubscriptionEventObj.orgName;
  const email = suspendSubscriptionEventObj.userEmail;
  const serviceName = suspendSubscriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    suspendSubscriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription resumed`;

  const message = `
              <html>
                  <body>
                      <p>Hello,</p>
                      <p>This is to inform you that your ${servicePlanName}subscription on ${serviceName} has been suspended. To reinstate your subscription, please contact support.</p>
                      <p>Sincerely</p>
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
  getSubscriptionSuspendedMailContent,
};
