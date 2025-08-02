import "dotenv/config";
import { notificationQueue, complianceQueue } from "../config/redis.js";
import { updateNotificationStatus } from "../services/notificationService.js";
import nodemailer from "nodemailer";

// Configure nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Process facilitator reminders - only if Redis is available
if (notificationQueue) {
  notificationQueue.process("facilitator-reminder", async (job) => {
  const { notificationId, facilitatorId, weekNumber, email, name } = job.data;

  try {
    console.log(`🔔 [${new Date().toISOString()}] Processing notification:`);
    console.log(`   📧 Facilitator: ${name} (${email})`);
    console.log(`   📅 Week: ${weekNumber}`);
    console.log(`   🆔 Notification ID: ${notificationId}`);
    console.log(
      `   ⏳ Processing reminder for facilitator ${facilitatorId}, week ${weekNumber}`
    );

    // Send real email with detailed message
    const info = await transporter.sendMail({
      from: `"LMS Notifications" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: `Facilitator Reminder - Week ${weekNumber}`,
      text: `Hello ${name},

This is a friendly reminder that you have not yet submitted your activity log for week ${weekNumber} on the LMS platform.

Please log in to your account and complete your weekly activity log as soon as possible. Timely submission helps ensure accurate tracking of course progress and compliance with academic requirements.

If you have already submitted your log, please disregard this message.

Thank you for your commitment!

Best regards,
LMS Team`,
    });

    console.log(`   ✅ Email sent successfully: ${info.response}`);
    console.log(`   📬 Message ID: ${info.messageId}`);

    // Update notification status to sent
    await updateNotificationStatus(notificationId, "sent");
    console.log(`   🔄 Notification status updated to 'sent'`);
    console.log(`   ✨ Reminder completed for ${name}\n`);

    return {
      success: true,
      notificationId,
      facilitatorId,
      weekNumber,
      message: `Reminder sent to ${email}`,
    };
  } catch (error) {
    console.error(`   ❌ [${new Date().toISOString()}] Facilitator reminder failed:`);
    console.error(`   🚨 Error: ${error.message}`);
    console.error(`   👤 Facilitator: ${name} (${email})`);
    console.error(`   📅 Week: ${weekNumber}\n`);
    
    await updateNotificationStatus(notificationId, "failed", {
      failureReason: error.message,
    });
    throw error;
  }
});
} else {
  console.log("⚠️  Redis not available - facilitator reminder processing disabled");
}

// Process manager alerts - only if Redis is available
if (complianceQueue) {
  complianceQueue.process("manager-alert", async (job) => {
  const { notificationId, managerId, email, name, alertType, data } = job.data;

  try {
    console.log(`🚨 [${new Date().toISOString()}] Processing manager alert:`);
    console.log(`   👨‍💼 Manager: ${name} (${email})`);
    console.log(`   📊 Alert Type: ${alertType}`);
    console.log(`   🆔 Notification ID: ${notificationId}`);
    console.log(`   📋 Processing alert for manager ${managerId}`);

    // Send real email with detailed message
    const info = await transporter.sendMail({
      from: `"LMS Notifications" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: `Manager Alert: ${alertType}`,
      text: `Hello ${name},
You have a new manager alert: ${alertType}.

Details:
${JSON.stringify(data, null, 2)}

This alert was generated because one or more facilitators have not completed their required activity logs or have missed a critical reporting deadline for this week.

Please review the details above and follow up as necessary to ensure compliance and smooth academic operations.

Thank you for your attention.

Best regards,
LMS Team`,
    });

    console.log("Manager email sent:", info.response);

    // Update notification status to sent
    await updateNotificationStatus(notificationId, "sent");
    console.log("Notification status updated to sent for manager");

    return {
      success: true,
      notificationId,
      managerId,
      alertType,
      message: `Alert sent to ${email}`,
    };
  } catch (error) {
    console.error("Manager alert error:", error);
    await updateNotificationStatus(notificationId, "failed", {
      failureReason: error.message,
    });
    throw error;
  }
});
} else {
  console.log("Redis not available - manager alert processing disabled");
}

console.log("Notification workers started");
