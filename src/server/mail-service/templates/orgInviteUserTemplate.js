const ejs = require("ejs");
const path = require("path");

async function getOrgInviteUserMailContent(inviteUserEventObj, orgLogoURL) {
  const signUpURL = encodeURI(
    `${process.env.YOUR_SAAS_DOMAIN_URL}/signup?org=${encodeURIComponent(
      inviteUserEventObj.orgName
    )}&orgUrl=${encodeURI(
      inviteUserEventObj.orgURL
    )}&email=${encodeURIComponent(inviteUserEventObj.userEmail)}`
  );
  const signInURL = `${process.env.YOUR_SAAS_DOMAIN_URL}/signin`;

  const userName = inviteUserEventObj.eventPayload.inviting_user_name;
  const serviceName = inviteUserEventObj.eventPayload.service_name;

  const subject = `Invitation to join ${userName}'s subscription on ${serviceName} service`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "orgInviteUser.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    user_name: userName,
    service_name: serviceName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    invite_user: `${baseURL}/public/mail/invite-user.png`,
    get_started: inviteUserEventObj.eventPayload.is_user_enabled
      ? signInURL
      : signUpURL,
    is_user_enabled: inviteUserEventObj.eventPayload.is_user_enabled,
  });

  // let message = ``;
  // if (inviteUserEventObj.eventPayload.is_user_enabled) {
  //   message = `
  // <html>
  //   <body>
  //     <p>Hello,</p>
  //     <p>You've been invited to join ${userName}'s subscription on ${serviceName} service.</p>
  //     <p>Please login to your account <a href="${signInURL}">here</a> to accept the invitation</p>
  //     <p>Thanks</p>
  //   </body>
  // </html>`;
  // } else {
  //   message = `
  // <html>
  //   <body>
  //     <p>Hello,</p>
  //     <p>You've been invited to join ${userName}'s subscription on ${serviceName} service.</p>
  //     <p>Create your account <a href="${signUpURL}">here</a> to accept the invitation</p>
  //     <p>Thanks</p>
  //   </body>
  // </html>`;
  // }

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
