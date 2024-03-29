import userService from "../services/userService";

let handleLogin = async (req, res) => {
  // lay gia tri tu phia client truyen len
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  let users = await userService.getAllUsers(id);
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
      users: [],
    });
  }
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let data = await userService.createNewUser(req.body);
  return res.status(200).json(data);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
    });
  }
  let data = await userService.deleteUser(req.body.id);
  return res.status(200).json(data);
};

let handleEditUser = async (req, res) => {
  try {
    let message = await userService.updateUser(req.body);
    return res.status(200).json(message);
  } catch (e) {}
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all code error: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


module.exports = {
  handleLogin: handleLogin,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
  handleGetAllUsers: handleGetAllUsers
};
