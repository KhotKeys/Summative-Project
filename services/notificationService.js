import { notificationQueue, complianceQueue } from "../config/redis.js";
import db from "../models/index.js";

// Create notification record
const createNotificationRecord = async (notificationData) => {
  try {
    return await db.Notification.create(notificationData);
  } catch (error) {
    console.error("Failed to create notification record:", error);
    throw error;
  }
};

// Queue facilitator reminder with DB record
export const queueFacilitatorReminder = async (facilitatorId, weekNumber) => {
  try {
    // Get facilitator details
    const facilitator = await db.Facilitator.findByPk(facilitatorId, {
      attributes: ["id", "name", "email"],
    });

    if (!facilitator) {
      throw new Error(`Facilitator ${facilitatorId} not found`);
    }

    // Create notification record
    const notification = await createNotificationRecord({
      type: "facilitator_reminder",
      recipientType: "facilitator",
      recipientId: facilitatorId,
      recipientEmail: facilitator.email,
      subject: `Activity Log Reminder - Week ${weekNumber}`,
      message: `Dear ${facilitator.name}, please submit your activity log for week ${weekNumber}.`,
      metadata: {
        weekNumber,
        facilitatorName: facilitator.name,
      },
      priority: "medium",
      scheduledAt: new Date(),
    });

    // Queue the job with notification ID
    await notificationQueue.add("facilitator-reminder", {
      notificationId: notification.id,
      facilitatorId,
      weekNumber,
      email: facilitator.email,
      name: facilitator.name,
    });

    console.log(
      `Queued reminder for facilitator ${facilitatorId}, week ${weekNumber}`
    );
    return notification;
  } catch (error) {
    console.error("Error queueing facilitator reminder:", error);
    throw error;
  }
};

// Queue manager alert with DB record
export const queueManagerAlert = async (alertType, data) => {
  try {
    // Get all managers
    const managers = await db.User.findAll({
      where: { role: "manager" },
      attributes: ["id", "name", "email"],
    });

    const notifications = [];

    for (const manager of managers) {
      const notification = await createNotificationRecord({
        type: "manager_alert",
        recipientType: "manager",
        recipientId: manager.id,
        recipientEmail: manager.email,
        subject: `Compliance Alert - ${alertType}`,
        message: `Compliance issue detected: ${JSON.stringify(data)}`,
        metadata: {
          alertType,
          ...data,
        },
        priority: "high",
        scheduledAt: new Date(),
      });

      await complianceQueue.add("manager-alert", {
        notificationId: notification.id,
        managerId: manager.id,
        email: manager.email,
        name: manager.name,
        alertType,
        data,
      });

      notifications.push(notification);
    }

    console.log(`Queued manager alert: ${alertType}`);
    return notifications;
  } catch (error) {
    console.error("Error queueing manager alert:", error);
    throw error;
  }
};

// Update notification status
export const updateNotificationStatus = async (
  notificationId,
  status,
  additionalData = {}
) => {
  try {
    const updateData = {
      status,
      ...additionalData,
    };

    if (status === "sent") {
      updateData.sentAt = new Date();
    }

    await db.Notification.update(updateData, {
      where: { id: notificationId },
    });
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
};

// Get notification history
export const getNotificationHistoryService = async (filters = {}) => {
  try {
    const { recipientId, type, status, limit = 50 } = filters;

    const where = {};
    if (recipientId) where.recipientId = recipientId;
    if (type) where.type = type;
    if (status) where.status = status;

    const notifications = await db.Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      include: [
        {
          model: db.User,
          as: "Recipient",
          attributes: ["name", "email"],
        },
      ],
    });

    return {
      data: notifications,
      count: notifications.length,
    };
  } catch (error) {
    console.error("Error getting notification history:", error);
    throw error;
  }
};

// Rest of your existing functions remain the same...
export const checkWeeklyComplianceService = async (weekNumber) => {
  const week = parseInt(weekNumber);
  const [totalAllocations, submittedLogs] = await Promise.all([
    db.Allocation.count(),
    db.ActivityTracker.count({ where: { weekNumber: week } }),
  ]);

  const complianceRate =
    totalAllocations > 0
      ? ((submittedLogs / totalAllocations) * 100).toFixed(2)
      : "0.00";

  if (parseFloat(complianceRate) < 80) {
    await queueManagerAlert("low_compliance", {
      weekNumber: week,
      complianceRate,
      totalAllocations,
      submittedLogs,
      missingLogs: totalAllocations - submittedLogs,
    });
  }

  return {
    weekNumber: week,
    complianceRate,
    totalAllocations,
    submittedLogs,
    alertSent: parseFloat(complianceRate) < 80,
  };
};

export const sendMissingRemindersService = async (weekNumber) => {
  const week = parseInt(weekNumber);

  const submittedAllocationIds = await db.ActivityTracker.findAll({
    where: { weekNumber: week },
    attributes: ["allocationId"],
  }).then((logs) => logs.map((log) => log.allocationId));

  const missingAllocations = await db.Allocation.findAll({
    where:
      submittedAllocationIds.length > 0
        ? {
            id: { [db.Sequelize.Op.notIn]: submittedAllocationIds },
          }
        : {},
    attributes: ["id", "facilitatorID"],
  });

  const reminderPromises = missingAllocations.map((allocation) =>
    queueFacilitatorReminder(allocation.facilitatorID, week)
  );

  await Promise.all(reminderPromises);

  return {
    weekNumber: week,
    missingAllocations: missingAllocations.length,
    remindersQueued: missingAllocations.length,
  };
};
