import pool from "../db/db.js";

export const getNotificationsByUser = async (
  userId
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};


export const getUnreadNotificationCount = async (userId) => {

  const result = await pool.query(
    `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = $1
    AND is_read = FALSE
    `,
    [userId]
  );

  return Number(result.rows[0].count);
};

export const markNotificationsAsRead =
async (userId) => {

  await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = $1
    `,
    [userId]
  );
};