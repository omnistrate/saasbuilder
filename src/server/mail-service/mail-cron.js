const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { getSignUpMailContent } = require("./templates/signupTemplate");
const {
  getOrgInviteUserMailContent,
} = require("./templates/orgInviteUserTemplate");
const {
  getOrgRevokeUserMailContent,
} = require("./templates/orgRevokeUserTemplate");
const { eventTypes } = require("./constants");
const { getEventsList, acknowledgeEvent } = require("../api/events");
const {
  getResetPasswordMailContent,
} = require("./templates/forgotPasswordTemplate");
const {
  getApproveSubscriptionMailContent,
} = require("./templates/approveSubscriptionRequest");
const {
  getDenySubscriptionMailContent,
} = require("./templates/denySubscriptionRequest");
const {
  getSubscriptionResumedMailContent,
} = require("./templates/resumeSubscription");
const {
  getSubscriptionSuspendedMailContent,
} = require("./templates/suspendSubscription");
const {
  getSubscriptionTerminateMailContent,
} = require("./templates/terminateSubscription");
const {
  getInvoiceCreatedTemplate,
} = require("./templates/invoiceCreatedTemplate");
const { getNodeMailerConfig } = require("./mail-config");

let isRunning = false;

function startMailServiceCron() {
  let mailTransporter = null;

  async function mailService() {
    if (isRunning) return;

    try {
      isRunning = true;
      if (mailTransporter === null) {
        mailTransporter = nodemailer.createTransport(getNodeMailerConfig());
      }
      await mailTransporter.verify();

      //Fetch all events
      const eventsResponse = await getEventsList();
      const events = eventsResponse.data.events || [];
      console.log("Events", events);
      let mailPromises = [];

      for (const event of events) {
        try {
          let mailContent = null;
          switch (event.eventType) {
            case eventTypes.CustomerSignUp: {
              mailContent = getSignUpMailContent(event);
              break;
            }

            case eventTypes.InviteUser: {
              mailContent = getOrgInviteUserMailContent(event);
              break;
            }

            case eventTypes.RevokeUserRole: {
              mailContent = getOrgRevokeUserMailContent(event);
              break;
            }

            case eventTypes.ResetPassword: {
              mailContent = getResetPasswordMailContent(event);
              break;
            }

            case eventTypes.ApproveSubscriptionRequest: {
              mailContent = getApproveSubscriptionMailContent(event);
              break;
            }

            case eventTypes.DenySubscriptionRequest: {
              mailContent = getDenySubscriptionMailContent(event);
              break;
            }

            case eventTypes.ResumeSubscription: {
              mailContent = getSubscriptionResumedMailContent(event);
              break;
            }

            case eventTypes.SuspendSubscription: {
              mailContent = getSubscriptionSuspendedMailContent(event);
              break;
            }

            case eventTypes.TerminateSubscription: {
              mailContent = getSubscriptionTerminateMailContent(event);
              break;
            }

            case eventTypes.InvoiceCreated: {
              mailContent = getInvoiceCreatedTemplate(event);
              break;
            }

            default:
              break;
          }

          if (mailContent) {
            //use address configured in MAIL_FROM. If not configured fallback to MAIL_USER_EMAIL
            const fromEmailAddress =
              process.env.MAIL_FROM || process.env.MAIL_USER_EMAIL;

            const mailPromise = mailTransporter
              .sendMail({
                from: `"${mailContent.senderName}" <${fromEmailAddress}>`,
                replyTo: fromEmailAddress,
                to: mailContent.recepientEmail,
                subject: mailContent.subject,
                html: mailContent.message,
              })
              .then(async () => {
                //call backend api
                await acknowledgeEvent(event.eventID);
                console.log("Event acknowledged", event);
              });

            mailPromises.push(mailPromise);
          }
        } catch (error) {
          console.error("Mail error", error);
        }
      }

      await Promise.all(mailPromises)
        .then((responses) => {
          if (mailPromises.length === events.length && events.length > 0)
            console.log("All mails sent and events acknowledged");
        })
        .finally(() => {
          isRunning = false;
        });
    } catch (error) {
      isRunning = false;
      console.error(error?.response?.data);
    }
  }
  //run cron job after every 30 seconds
  cron.schedule("*/30 * * * * *", function () {
    console.log("Running mail service cron job");
    mailService();
  });
}

module.exports = { startMailServiceCron };
