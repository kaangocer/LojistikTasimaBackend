import {
  getNotificationsByUser,
  getUnreadNotificationCount,
  markNotificationsAsRead
} from "../services/notification.service.js";

export const getMyNotifications =
async (req, res) => {

  try {

    const notifications =
      await getNotificationsByUser(
        req.user.userId
      );

    res.json(notifications);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Bildirimler alınamadı"
    });
  }
};


export const getUnreadCount = async (req, res) => {
  try {

    const count =
      await getUnreadNotificationCount(
        req.user.userId
      );

    res.json({ count });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Hata oluştu"
    });
  }
};


export const markAsRead =
async (req, res) => {

  await markNotificationsAsRead(
    req.user.userId
  );

  res.json({
    success: true
  });
};