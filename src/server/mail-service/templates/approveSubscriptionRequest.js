const ejs = require("ejs");
const path = require("path");

async function getApproveSubscriptionMailContent(approveSubsriptionEventObj) {
  const orgName = approveSubsriptionEventObj.orgName;
  const email = approveSubsriptionEventObj.userEmail;
  const serviceName = approveSubsriptionEventObj.eventPayload.service_name;
  const servicePlanName =
    approveSubsriptionEventObj.eventPayload.product_tier_name;

  const subject = `Your ${serviceName} - ${servicePlanName} subscription request approved`;

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

  // const message = `
  //       <html>
  //           <body>
  //               <p>Hello,</p>
  //               <p>We're pleased to confirm that your subscription to the ${servicePlanName} plan on ${serviceName} has been approved. You can now start to use the service.</p>
  //               <p>If you have any questions, please contact support.</p>
  //               <p>Sincerely</p>
  //               <p>The ${serviceName} Team</p>
  //           </body>
  //       </html>`;

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
