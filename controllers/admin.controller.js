import {
  getAllUsers,
  deleteUser,
  updateUserRole
} from "../services/admin.service.js";

export const getUsers = async (req, res) => {
  try {

    const users = await getAllUsers(
      req.user.userId
    );

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

export const removeUser = async (
  req,
  res
) => {
  try {

    await deleteUser(
      req.user.userId,
      req.params.id
    );

    res.json({
      message: "Kullanıcı silindi"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

export const changeRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    await updateUserRole(
  req.user.userId,
  req.params.id,
  req.body.role
);

    res.json({
      message: "Rol güncellendi"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};