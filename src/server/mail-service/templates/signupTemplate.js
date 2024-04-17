const ejs = require("ejs");
const path = require("path");

async function getSignUpMailContent(signUpEventObj, orgLogoURL) {
  // orgID = signUpEventObj.orgID;
  const email = signUpEventObj.userEmail;

  // [username, provider] = email.split("@");
  //const encodedEmail = encodeURIComponent(username + `+${orgID}@` + provider);
  const activationURL = encodeURI(
    `${
      process.env.YOUR_SAAS_DOMAIN_URL
    }/validate-token?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(signUpEventObj.eventPayload.token)}`
  );

  const subject = `Please confirm your ${signUpEventObj.orgName} registration`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "userSignUp.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    user_signup: `${baseURL}/public/mail/user-signup.png`,
    get_started: activationURL,
  });

  // const message = `
  //   <html>
  //       <body>
  //           <p>Hello,</p>
  //           <p>Thanks for signing up.</p>
  //           <p>To activate your account, please click <a href="${activationURL}">here</a> to confirm your registration</p>
  //           <p>Thanks</p>
  //       </body>
  //   </html>`;

  return {
    recepientEmail: signUpEventObj.userEmail,
    subject: subject,
    message: message,
    senderName: signUpEventObj.orgName,
  };
}

module.exports = {
  getSignUpMailContent,
};
