import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

//hash password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

//Login
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exist
        let user = await db.User.findOne({
          attributes: [ "id", "email", "roleId", "password", "firstName", "lastName", ],
          where: { email: email },
          raw: true,
        });

        if (user) {
          // compare password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        // return error
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exist in your system.Plz try other Email`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

//check email login
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      user ? resolve(true) : resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async(resolve, reject) => {
    try{
      let users = '';
      if(userId === 'ALL'){
        users = await db.User.findAll({
          attributes: { exclude: ['password']}
        })
      }
      if(userId && userId !== 'ALL'){
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ['password']}
        })
      }
      resolve(users);
    }catch(e){
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      let check = await checkUserEmail(data.email);
      if(check === true){
        resolve({
          errCode: 1,
          errMessage: 'Email is exist'
        })
      }else{
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          image: data.avatar
        })
        resolve({
          errCode: 0,
          message: 'OK'
        })
      }
    }catch(e){
      reject(e);
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async(resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId }
    })
    if(!foundUser){
      resolve({
        errCode: 2,
        errMessage: 'The user is not exist'
      });
    }
    await db.User.destroy({
      where: { id: userId}
    });
    resolve({
      errCode: 0,
      message: 'The user is deleted'
    })
  });
};

let updateUser = (data) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!data.id){
        resolve({
          errCode: 2,
          errMessage: 'Missing required parameter'
        })
      }
      let user = await db.User.findOne({
        where: { id: data.id }
      })
      if(user){
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.gender = data.gender;
        user.phoneNumber = data.phoneNumber;
        if(data.avatar){
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          errCode: 0,
          message: 'Update succeeds'
        })
      }else{
        resolve({
          errCode: 1,
          errMessage: 'User not found'
        })
      }
    }catch(e){
      reject(e);
    }
  })
}

let getAllCodeService = (typeInput) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!typeInput){
        resolve({
          errCode: 1,
          errMessage: 'Missing required paramter'
        })
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({ where: { type: typeInput } });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    }catch(e){
      reject(e);
    }
  })
}

let getDetailUser = async(req, res) => {
  try {
      let data = await userService.getDetailUserService(req.query.id);
      return res.status(200).json(data);
  } catch (e) {
      console.log('get detail user error: ', e)
      return res.status(200).json({
          errCode: -1,
          errMessage: 'Error from server'
      })
  }
}

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getAllCodeService: getAllCodeService,
  
};