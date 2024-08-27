import ResponsePreset from "../../helpers/ResponsePreset.helper.js";
import AuthService from "../../services/admin/Auth.service.js";

// Validator
import AuthValidator from "../../validators/admin/Auth.validator.js";

// Libray
import Ajv from 'ajv';

class AuthController {
  constructor(server) {
    this.server = server;

    this.AuthService = new AuthService(this.server);
    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.AuthValidator = new AuthValidator();
  }

  async login(req, res) {
    const schemeValidate = this.Ajv.compile(this.AuthValidator.login);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const loginSrv = await this.AuthService.login(req.body.username, req.body.password);

    if(loginSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Username or Password is Wrong',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      loginSrv
    ));
  }

  async tokenCheck(req, res) {
    const userUUID = req.middlewares.authorization.data.uuid;
    const tokenCheckSrv = await this.AuthService.tokenCheck(userUUID);
    
    if(tokenCheckSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, User UUID Not Exist',
      'service',
      { code: -1 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK('OK', tokenCheckSrv));
  }
}

export default AuthController;