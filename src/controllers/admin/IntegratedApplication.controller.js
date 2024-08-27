import ResponsePreset from "../../helpers/ResponsePreset.helper.js";
import IntegratedApplicationService from "../../services/admin/IntegratedApplication.service.js";

// Validator
import IntegratedApplicationValidator from "../../validators/admin/IntegratedApplication.validator.js";

// Libray
import Ajv from 'ajv';

class IntegratedApplicationController {
  constructor(server) {
    this.server = server;

    this.IntegratedApplicationService = new IntegratedApplicationService(this.server);
    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.IntegratedApplicationValidator = new IntegratedApplicationValidator();
  }

  async createApp(req, res) {
    const schemeValidate = this.Ajv.compile(this.IntegratedApplicationValidator.createApp);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));
    
    const createAppSrv = await this.IntegratedApplicationService.createApp(req.body.name, req.body.email, req.body.logo);

    if(createAppSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Logo Not Provide',
      'service',
      { code: -1 }
    ));

    if(createAppSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Logo is too large',
      'service',
      { code: -2 }
    ));

    if(createAppSrv === -3) return res.status(415).json(this.ResponsePreset.resErr(
      415,
      'Unsupported Media Type, Logo type not acceptable',
      'service',
      { code: -3 }
    ));

    if(createAppSrv === -500) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Transaction Error, Something wrong with your input',
      'server',
      { code: -500 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK'
    ));
  }

  async detailApp(req, res) {
    const { uuid } = req.query;

    if(!uuid) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, UUID not provide',
      'service',
      { code: -1 }
    ));

    const detailAppSrv = await this.IntegratedApplicationService.detailApp(uuid);

    if(detailAppSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, UUID not found',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK', detailAppSrv
    ));
  }

  async listApp(req, res) {
    const listAppSrv = await this.IntegratedApplicationService.listApp();

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK', listAppSrv
    ));
  }

  async deleteApp(req, res) {
    const { uuid } = req.query;

    if(!uuid) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, UUID not provide',
      'service',
      { code: -1 }
    ));

    const deleteAppSrv = await this.IntegratedApplicationService.deleteApp(uuid);

    if(deleteAppSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, UUID not found',
      'service',
      { code: -2 }
    ));

    if(deleteAppSrv === -500) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Transaction Error, Something wrong with your input',
      'server',
      { code: -500 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK'
    ));
  }

  async editApp(req, res) {
    const schemeValidate = this.Ajv.compile(this.IntegratedApplicationValidator.editApp);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const { uuid } = req.query;

    if(!uuid) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, UUID not provide',
      'service',
      { code: -1 }
    ));

    const editAppSrv = await this.IntegratedApplicationService.editApp(
      uuid,
      req.body.name,
      req.body.email,
      req.body.balance,
      req.body.logo
    );

    if(editAppSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, UUID not found',
      'service',
      { code: -2 }
    ));

    if(editAppSrv === -2) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, Logo is not provide',
      'service',
      { code: -3 }
    ));

    if(editAppSrv === -3) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Logo is too large',
      'service',
      { code: -4 }
    ));

    if(editAppSrv === -4) return res.status(415).json(this.ResponsePreset.resErr(
      415,
      'Unsupported Media Type, Logo type not acceptable',
      'service',
      { code: -5 }
    ));

    if(editAppSrv === -500) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Transaction Error, Something wrong with your input',
      'server',
      { code: -500 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK'
    ));
  }

  async appStats(req, res) {
    const { uuid } = req.query;

    if(!uuid) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, UUID not provide',
      'service',
      { code: -1 }
    ));

    const appStatsSrv = await this.IntegratedApplicationService.appStats(uuid);

    if(appStatsSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      404,
      'Not Found, UUID not found',
      'service',
      { code: -2 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK', appStatsSrv
    ));
  }
}

export default IntegratedApplicationController;