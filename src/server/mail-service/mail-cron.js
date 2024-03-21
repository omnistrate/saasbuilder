const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { getSignUpMailContent } = require("./signupTemplate");
const { getOrgInviteUserMailContent } = require("./orgInviteUserTemplate");
const { getOrgRevokeUserMailContent } = require("./orgRevokeUserTemplate");
const { eventTypes } = require("./constants");
const { getEventsList, acknowledgeEvent } = require("../api/events");
const { getResetPasswordMailContent } = require("./forgotPasswordTemplate");

let isRunning = false;

function startMailServiceCron() {
  let mailTransporter = null;

  async function mailService() {
    if (isRunning) return;

    try {
      isRunning = true;
      if (mailTransporter === null) {
        mailTransporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAIL_USER_EMAIL,
            pass: process.env.MAIL_USER_PASSWORD,
          },
        });
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

            default:
              break;
          }

          if (mailContent) {
            const mailPromise = mailTransporter
              .sendMail({
                from: `"${mailContent.senderName}" ${process.env.MAIL_FROM}`,
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
          if (mailPromises.length === events.length)
            console.log("All mails sent and events acknowledged");
        })
        .finally(() => {
          isRunning = false;
        });
    } catch (error) {
      isRunning = false;
      console.error(error);
    }
  }
  //run cron job after every 30 seconds
  cron.schedule("*/30 * * * * *", function () {
    console.log("Running mail service cron job");
    mailService();
  });
}

module.exports = { startMailServiceCron };
