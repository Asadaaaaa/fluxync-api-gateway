import ResponsePreset from '../../helpers/ResponsePreset.helper.js';
// import UsersModel from '../../models/Users.model.js';

// Library
import JWT from "jsonwebtoken";

class Authorization {
  constructor(server) {
    this.server = server;
    this.ResponsePreset = new ResponsePreset();

    // this.UsersModel = new UsersModel(this.server).table;
    this.UsersModel = null;
  }

  check() {
    return (req, res, next) => {
      if(!req.headers['authorization'] && req.query.token) req.headers['authorization'] = req.query.token;
      req.middlewares.authorization = {};
      const token = req.headers['authorization'];
      
      if(!token || token === 'undefined') {
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
          
          if(!req.path.endsWith('/auth/refresh-token')) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'Token Expired',
            'token',
            { code: -3 }
          ));
          
          data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        }
        
        if(req.path.endsWith('/auth/validation-verification') || req.path.endsWith('/auth/resend-verification')) {
          if(data.notVerified !== true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Already Verified',
            'token',
            { code: -4 }
          ));
        }
        
        if(!(req.path.endsWith('/auth/validation-verification') || req.path.endsWith('/auth/resend-verification'))) {
          if(data.notVerified === true) return res.status(401).json(this.ResponsePreset.resErr(
            401,
            'User in Token is Not Verified',
            'token',
            { code: -5 }
          ));
        }

        if(req.path.includes('/primary/masterdata')) {
          req.middlewares.authorization = data;
          return next();
        }
        
        if(data.data.adminToken === true) return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Token Unauthorized',
          'token',
          { code: -2 }
        ));

        const getDataUserModel = await this.UsersModel.findOne({
          where: {
            uuid: data.data.userUUID
          }
        });

        if(getDataUserModel === null) return res.status(401).json(this.ResponsePreset.resErr(
          401,
          'Token Unauthorized',
          'token',
          { code: -2 }
        )); 

        req.middlewares.authorization = data;

        return next();
      });
    }
  }
}

export default Authorization;
