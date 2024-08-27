// Models
import AdminAccountsModel from "../../models/AdminAccounts.model.js";

// Helpers
import JwtHelper from "../../helpers/JWT.helper.js";
import Sha256Helper from "../../helpers/SHA256.helper.js";

class AuthService {
  constructor(server) {
    this.server = server;

    // Init Models
    this.AdminAccountsModel = new AdminAccountsModel(this.server).table;

    // Init Helpers
    this.JwtHelper = new JwtHelper(this.server);
    this.Sha256Helper = new Sha256Helper(this.server);
  }

  async login(username, password) {
    const getAdminAccountsModel = await this.AdminAccountsModel.findOne({
      where: {
        username: username
      }
    });

    if(getAdminAccountsModel === null) return -1;

    password = this.Sha256Helper.getHash(password, getAdminAccountsModel.dataValues.hashing_salt);
    

    if(getAdminAccountsModel.dataValues.password !== password) return -1;

    const token = this.JwtHelper.generateTokenAdmin({
      uuid: getAdminAccountsModel.dataValues.uuid,
      adminToken: true
    });

    return token;
  }

  async tokenCheck(userUUID) {
    const getAdminAccountsModel = await this.AdminAccountsModel.findOne({
      where: {
        uuid: userUUID
      }
    });

    if(getAdminAccountsModel === null) return -1;
    
    return {
      name: getAdminAccountsModel.dataValues.name,
      username: getAdminAccountsModel.dataValues.username
    }
  }
}

export default AuthService;