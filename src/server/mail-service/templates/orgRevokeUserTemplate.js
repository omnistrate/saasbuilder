const ejs = require("ejs");
const path = require("path");

async function getOrgRevokeUserMailContent(revokeUserEventObj, orgLogoURL) {
  const userName = revokeUserEventObj.eventPayload.inviting_user_name;
  const serviceName = revokeUserEventObj.eventPayload.service_name;

  const subject = `Access revoked for ${userName}'s subscription on ${serviceName} service`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "revokeAccess.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    user_name: userName,
    service_name: serviceName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    revoke_access: `${baseURL}/public/mail/revoke-access.png`,
  });

  // const message = `
  //   <html>
  //     <body>
  //       <p>Hello,</p>
  //       <p>You’ve been removed from ${userName}'s subscription on ${serviceName} service</p>
  //       <p>If you have any question, please contact the subscription owner</p>
  //       <p>Thanks</p>
  //     </body>
  //   </html>`;

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
