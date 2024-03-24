function getInvoiceCreatedTemplate(invoiceCreatedEventObj) {
  const userEmail = invoiceCreatedEventObj.eventPayload.user_email;
  const invoiceId = invoiceCreatedEventObj.eventPayload.invoice_id;
  const orgName = invoiceCreatedEventObj.orgName;

  const subject = `Invoice generated - Pay up!`;
  const signInURL = `${process.env.YOUR_SAAS_DOMAIN_URL}/signin`;

  const message = `
      <html>
        <body>
          <p>Hello,</p>
          <p></p>
          <p>Please login to your account <a href="${signInURL}">here</a> to view the invoice</p>
          <p>Thanks</p>
        </body>
      </html>`;

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

// {
//   eventID: "e-123456",
//   eventPayload: {
//     user_id: "user-12345",
//     user_email: "abc@example.com",
//     invoice_id: "invoice_12345",
//   },
//   eventType: "InvoiceCreated",
//   orgID: "o-123456",
//   orgName: "Acme Corp",
//   orgURL: "https://acme.com",
//   time: "2023-01-10T00:00:00Z",
//   userEmail: "abc@example.com",
//   userID: "u-123456",
// },
