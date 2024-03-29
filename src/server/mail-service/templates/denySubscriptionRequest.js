function getDenySubscriptionMailContent(denySubsriptionEventObj) {
  const orgName = denySubsriptionEventObj.orgName;
  const email = denySubsriptionEventObj.userEmail;
  const serviceName = denySubsriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    denySubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription request denied`;

  const message = `
          <html>
              <body>
                  <p>Hello,</p>
                  <p>We regret to inform you that your subscription request for the ${servicePlanName} plan on ${serviceName} has been denied.</p>
                  <p>If you have any questions, please contact support.</p>
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
  getDenySubscriptionMailContent,
};
