const ejs = require("ejs");
const path = require("path");

async function getResetPasswordMailContent(resetPasswordEventObj, orgLogoURL) {
  const orgName = resetPasswordEventObj.orgName;
  const email = resetPasswordEventObj.userEmail;
  const token = resetPasswordEventObj.eventPayload.token;

  const resetPasswordPageURL = encodeURI(
    `${
      process.env.YOUR_SAAS_DOMAIN_URL
    }/change-password?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`
  );

  const subject = `Reset Password request for your ${orgName} account`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "forgotPassword.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    reset_password: `${baseURL}/public/mail/reset-password.png`,
    get_started: resetPasswordPageURL,
  });

  // const message = `
  //     <html>
  //         <body>
  //             <p>Hello,</p>
  //             <p>To reset your password, please click here <a href="${resetPasswordPageURL}">here</a></p>
  //             <p>Thanks</p>
  //         </body>
  //     </html>`;

  const recepientEmail = resetPasswordEventObj.userEmail;

  let mailContent = null;
  if (orgName && email && token && recepientEmail) {
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
  getResetPasswordMailContent,
};
