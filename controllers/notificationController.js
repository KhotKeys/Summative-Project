import {
  checkWeeklyComplianceService,
  sendMissingRemindersService,
} from "../services/notificationService.js";

// Manual compliance check
export const triggerComplianceCheck = async (req, res) => {
  try {
    const result = await checkWeeklyComplianceService(req.params.weekNumber);
    res.json({
      message: "Compliance check completed",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manual reminder sending
export const sendReminders = async (req, res) => {
  try {
    const result = await sendMissingRemindersService(req.params.weekNumber);
    res.json({
      message:
        "Reminders queued successfully. Emails will be sent to facilitators shortly.",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
