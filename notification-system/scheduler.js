import cron from "node-cron";
import {
  checkWeeklyComplianceService,
  sendMissingRemindersService,
} from "../services/notificationService.js";

const getCurrentWeek = () => Math.ceil(new Date().getDate() / 7);

// Schedule compliance checks
export const startNotificationScheduler = () => {
  // Check compliance daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    const currentWeek = getCurrentWeek();

    try {
      console.log(`Running compliance check for week ${currentWeek}`);

      const complianceResult = await checkWeeklyComplianceService(currentWeek);
      console.log("Compliance check:", complianceResult);

      if (complianceResult.submittedLogs < complianceResult.totalAllocations) {
        const reminderResult = await sendMissingRemindersService(currentWeek);
        console.log("Reminders sent:", reminderResult);
      }
    } catch (error) {
      console.error("Scheduler error:", error);
    }
  });

  console.log("Notification scheduler started");
};
