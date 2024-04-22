const ejs = require("ejs");
const path = require("path");

async function getInvoiceCreatedTemplate(invoiceCreatedEventObj, orgLogoURL) {
  const userEmail = invoiceCreatedEventObj.eventPayload.user_email;
  const invoiceId = invoiceCreatedEventObj.eventPayload.invoice_id;
  const orgName = invoiceCreatedEventObj.orgName;

  const subject = `${orgName} new invoice ${invoiceId} is now available`;
  const signInURL = `${process.env.YOUR_SAAS_DOMAIN_URL}/signin`;

  const templatePath = path.resolve(
    __dirname,
    "..",
    "ejsTemplates",
    "invoiceCreated.ejs"
  );

  const baseURL = process.env.YOUR_SAAS_DOMAIN_URL;

  const message = await ejs.renderFile(templatePath, {
    org_name: orgName,
    logo_url: orgLogoURL,
    bottom_bg_image_url: `${baseURL}/public/mail/bottom-bg.png`,
    hero_banner: `${baseURL}/public/mail/cloud-hero-section.png`,
    invoice_created: `${baseURL}/public/mail/invoice-create.png`,
    view_invoice: `${baseURL}/signin`,
  });

  // const message = `
  //     <html>
  //       <body>
  //         <p>Hello,</p>
  //         <p>
  //           A new invoice for your ${orgName} subscription has been generated. You can review and access your invoice by logging into your account <a href="${signInURL}">here</a>.
  //         </p>
  //         <p>Thank you for your continued business.</p>
  //         <p>Sincerely,</p>
  //         <p>${orgName} team</p>
  //       </body>
  //     </html>`;

  let mailContent = null;

  if (userEmail && invoiceId && orgName) {
    mailContent = {
      recepientEmail: userEmail,
      subject: subject,
      message: message,
      senderName: orgName,
    };
  }

  return mailContent;
}

module.exports = {
  getInvoiceCreatedTemplate,
};
