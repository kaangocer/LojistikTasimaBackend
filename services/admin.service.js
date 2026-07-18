import pool from "../db/db.js";

export const getAllUsers = async (currentUserId) => {

  const result = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.surname,
      u.phone,
      u.tc_no,
      u.birth,
      r.role_name,
      u.created_at
    FROM users u
    LEFT JOIN roles r
      ON r.id = u.role_id
    WHERE u.id != $1
    ORDER BY u.created_at DESC
  `, [currentUserId]);

  return result.rows;
};

export const deleteUser = async (
  currentUserId,
  userId
) => {

  if (currentUserId === userId) {
    throw new Error(
      "Kendinizi silemezsiniz"
    );
  }

  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new Error(
      "Kullanıcı bulunamadı"
    );
  }
};

export const updateUserRole = async (
  currentUserId,
  userId,
  roleName
) => {

  if (currentUserId === userId) {
    throw new Error(
      "Kendi rolünüzü değiştiremezsiniz"
    );
  }

  const role = await pool.query(
    `
    SELECT id
    FROM roles
    WHERE role_name = $1
    `,
    [roleName]
  );

  if (!role.rows.length) {
    throw new Error("Rol bulunamadı");
  }

  await pool.query(
    `
    UPDATE users
    SET role_id = $1
    WHERE id = $2
    `,
    [
      role.rows[0].id,
      userId
    ]
  );
};