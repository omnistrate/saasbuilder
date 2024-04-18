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

  const subject = `Action Required: Please activate your ${signUpEventObj.orgName} account now`;

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
  //            <p>Thanks for signing up. We're excited to have you onboard.</p>
  // <p>To begin using the service, please activate your account by clicking <a href="${activationURL}">here</a>.</p>
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
