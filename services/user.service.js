import pool from "../db/db.js";
import bcrypt from "bcrypt";

export const updateUserProfile = async (
  userId,
  { phone, password, email, oldPassword }
) => {
  // 🔐 mevcut şifreyi doğrula
  const userRes = await pool.query(
    "SELECT password FROM users WHERE id = $1",
    [userId]
  );

  if (userRes.rowCount === 0) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const isMatch = await bcrypt.compare(
    oldPassword,
    userRes.rows[0].password
  );

  if (!isMatch) {
    throw new Error("Mevcut şifre yanlış");
  }

  const fields = [];
  const values = [];

  if (phone) {
    values.push(phone);
    fields.push(`phone = $${values.length}`);
  }

  if (email) {
    values.push(email);
    fields.push(`email = $${values.length}`);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    values.push(hashedPassword);
    fields.push(`password = $${values.length}`);
  }

  if (fields.length === 0) {
    throw new Error("Güncellenecek alan yok");
  }

  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING id
  `;

  await pool.query(query, values);
};



export const getUserProfile = async (userId) => {
  const query = `
    SELECT 
      id,
      name,
      surname,
      tc_no,
      to_char(birth, 'YYYY-MM-DD') AS birth,
      phone,
      email,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') AS created_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [userId]);

  if (result.rowCount === 0) {
    throw new Error("Kullanıcı bulunamadı");
  }

  return result.rows[0];
};
