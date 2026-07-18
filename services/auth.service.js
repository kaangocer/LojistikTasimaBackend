import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (data) => {
  const { tc_no, name, surname, phone, password, birth } = data;

  if (!tc_no || !phone || !password) {
    throw new Error("Zorunlu alanlar eksik");
  }

  // kullanıcı sayısı
  const countResult = await pool.query(`SELECT COUNT(*) FROM users`);
  const userCount = parseInt(countResult.rows[0].count);

  const roleName = userCount === 0 ? "admin" : "user";

  const roleResult = await pool.query(
    `SELECT id FROM roles WHERE role_name = $1`,
    [roleName]
  );

  const roleId = roleResult.rows[0].id;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users
    (tc_no, name, surname, phone, password, birth, role_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id
    `,
    [tc_no, name, surname, phone, hashedPassword, birth, roleId]
  );


  return result.rows[0];
};


//login


export const loginUser = async ({ phone, password }) => {
  if (!phone || !password) {
    throw new Error("Telefon ve şifre zorunlu");
  }

  const result = await pool.query(
    `
    SELECT u.id, u.name, u.surname, u.password, r.role_name
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.phone = $1
    `,
    [phone]
  );

  if (result.rows.length === 0) {
    throw new Error("Kullanıcı bulunamadı");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Şifre hatalı");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role_name
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role_name
    }
  };
};
