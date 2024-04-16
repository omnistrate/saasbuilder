const ejs = require("ejs");
const path = require("path");

async function getSubscriptionSuspendedMailContent(
  suspendSubscriptionEventObj
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

  const message = await ejs.renderFile(templatePath, {
    service_plan_name: servicePlanName,
    service_name: serviceName,
    logo_url:
      "https://static.vecteezy.com/system/resources/thumbnails/022/339/377/small/construction-building-company-logo-design-vector.jpg",
    bottom_bg_image_url:
      "https://cdn-icons-png.flaticon.com/512/9709/9709605.png",
    hero_banner: "https://cdn-icons-png.flaticon.com/512/9709/9709605.png",
    content_check_circle:
      "https://cdn-icons-png.flaticon.com/512/9709/9709605.png",
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
