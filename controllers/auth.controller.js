import { registerUser, loginUser } from "../services/auth.service.js";

//register
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "Kayıt başarılı",
      userId: user.id
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  //login
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json({
      message: "Giriş başarılı",
      token: result.token,
      user: result.user
    });
  } catch (err) {
    res.status(401).json({
      message: err.message
    });
  }
}

import { getUserProfile } from "../services/user.service.js"; 

export const me = async (req, res) => {
  try {
    const { userId } = req.user; // authMiddleware ile
    const user = await getUserProfile(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

