const ejs = require("ejs");
const path = require("path");

async function getSubscriptionSuspendedMailContent(
  suspendSubscriptionEventObj,
  orgLogoURL
) {
  const orgName = suspendSubscriptionEventObj.orgName;
  const email = suspendSubscriptionEventObj.userEmail;
  const serviceName = suspendSubscriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    suspendSubscriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription suspended`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "suspendSubscription.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    service_plan_name: servicePlanName,
    service_name: serviceName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    approve_subscription_request: `${baseURL}/public/mail/suspend-subscription.png`,
    get_started: `${baseURL}/signin`,
  });

  // const message = ` <html>
  //                 <body>
  //                     <p>Hello,</p>
  //                     <p>This is to inform you that your ${servicePlanName} subscription on ${serviceName} has been suspended. To reinstate your subscription, please contact support.</p>
  //                     <p>Sincerely,</p>
  //                     <p>The ${serviceName} Team</p>
  //                 </body>
  //             </html>`;

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
