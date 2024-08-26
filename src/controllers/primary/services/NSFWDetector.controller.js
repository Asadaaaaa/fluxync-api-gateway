import ResponsePreset from '../../../helpers/ResponsePreset.helper.js';
import NSFWDetectorValidator from '../../../validators/primary/services/NSFWDetector.validator.js';
import NSFWDetectorService from '../../../services/primary/services/NSFWDetector.service.js';

// Library
import Ajv from 'ajv';

class NSFWDetectorController {
  constructor(server) {
    this.server = server;

    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.NSFWDetectorValidator = new NSFWDetectorValidator();
    this.NSFWDetectorService = new NSFWDetectorService(this.server);
  }

  async demoDetector(req, res) {
    const schemeValidate = this.Ajv.compile(this.NSFWDetectorValidator.demoDetector);
    
    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      'validator',
      schemeValidate.errors[0]
    ));

    const { image } = req.body;
    
    const demoPredictSrv = await this.NSFWDetectorService.demoDetector(image);
    if(demoPredictSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
      400,
      'Bad Request, Image Not Provide',
      'service',
      { code: -1 }
    ));

    if(demoPredictSrv === -2) return res.status(403).json(this.ResponsePreset.resErr(
      403,
      'Forbidden, Image is too large',
      'service',
      { code: -2 }
    ));

    if(demoPredictSrv === -3) return res.status(415).json(this.ResponsePreset.resErr(
      415,
      'Unsupported Media Type, Image type not acceptable',
      'service',
      { code: -3 }
    ));

    if(demoPredictSrv === -4) return res.status(500).json(this.ResponsePreset.resErr(
      500,
      'Internal Server Error, NSFW Detector Service Error',
      'service',
      { code: -4 }
    ));

    return res.status(200).json(this.ResponsePreset.resOK(
      'OK',
      demoPredictSrv
    ));   
  }

}

export default NSFWDetectorController;