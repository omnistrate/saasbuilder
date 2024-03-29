function getApproveSubscriptionMailContent(approveSubsriptionEventObj) {
  const orgName = approveSubsriptionEventObj.orgName;
  const email = approveSubsriptionEventObj.userEmail;
  const serviceName = approveSubsriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    approveSubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription request approved`;

  const message = `
        <html>
            <body>
                <p>Hello,</p>
                <p>We're pleased to confirm that your subscription to the ${servicePlanName} plan on ${serviceName} has been approved. You can now start to use the service.</p>
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
  getApproveSubscriptionMailContent,
};
