import { updateUserProfile, getUserProfile } from "../services/user.service.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phone, password, email, oldPassword } = req.body;

    if (!phone && !password && !email) {
      return res.status(400).json({
        message: "Telefon, email veya şifre gönderilmelidir",
      });
    }

    if (!oldPassword) {
      return res.status(400).json({
        message: "Güncelleme için mevcut şifre gereklidir",
      });
    }

    await updateUserProfile(userId, {
      phone,
      password,
      email,
      oldPassword,
    });

    res.json({ message: "Profil başarıyla güncellendi" });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Profil güncellenemedi",
    });
  }
};



export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await getUserProfile(userId);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Profil getirilemedi",
    });
  }
};
