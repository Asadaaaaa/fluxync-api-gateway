import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
import AdminAccountsModel from '../../models/AdminAccounts.model.js';

// Library
import JWT from "jsonwebtoken";

class Authorization {
  constructor(server) {
    this.server = server;
    this.ResponsePreset = new ResponsePreset();

    this.AdminAccountsModel = new AdminAccountsModel(this.server).table;
  }

  check() {
    return (req, res, next) => {
      if(!req.headers['authorization'] && req.query.token) req.headers['authorization'] = req.query.token;
      req.middlewares.authorization = {};
      const token = req.headers['authorization'];
      
      if(!token || token === 'undefined') {
        if(this.optionalRoutes(req) === true) return next();

        return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Request Unauthorized',
          'token',
          { code: -1 }
        ));
      };
      
      JWT.verify(token, this.server.env.JWT_TOKEN_SECRET, async (err, data) => {
        if(err) {
          if(err.name !== 'TokenExpiredError') return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Unauthorized',
            'token',
            { code: -2 }
          ));
          
          return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Expired',
            'token',
            { code: -3 }
          ));
        }

        const getDataUserModel = await this.AdminAccountsModel.findOne({
          where: {
            uuid: data.data.uuid
          }
        });

        if(getDataUserModel === null) return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Token Unauthorized',
          'token',
          { code: -2 }
        )); 
        
        if(data.data.adminToken === true) {
          // this.adminPermission(res, data.data.permission);
        } else {
          return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Unauthorized, This is not an admin token',
            'token',
            { code: -2 }
          )); 
        }

        data.data.user_id = getDataUserModel.dataValues.id;
        req.middlewares.authorization = data;

        return next();
      });
    }
  }

  adminPermission(res, level) {
    return;
  }

  optionalRoutes(req) {
    switch(true) {
      default: return false;
    }
  }

}

export default Authorization;