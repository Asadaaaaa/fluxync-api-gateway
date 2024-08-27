import FileSystemHelper from "../../../helpers/FileSystem.helper.js";

import IntegratedApplicationsModel from "../../../models/IntegratedApplication.model.js";
import NSFWDetectionModel from "../../../models/NSFWDetection.model.js";

import { customAlphabet } from 'nanoid';

class NSFWDetectorService {
  constructor(server) {
    this.server = server;

    this.IntegratedApplicationsModel = new IntegratedApplicationsModel(this.server).table;
    this.NSFWDetectionModel = new NSFWDetectionModel(this.server).table;

    this.FileSystemHelper = new FileSystemHelper(this.server);    
  }

  async demoDetector(image, uuid, secret_key) {
    let getDataIntegratedApplicationsModel = null;
    if(uuid) {
      getDataIntegratedApplicationsModel = await this.IntegratedApplicationsModel.findOne({
        where: {
          uuid: uuid,
          secret_key: secret_key
        }
      });
    }
    
    const getFile = await this.FileSystemHelper.fileValidationBase64(image, ['jpg', 'png', 'jpeg'], 3, true, true);
    if(getFile === -1) return -1;
    if(getFile === -2) return -2;
    if(getFile === -3) return -3;

    let randomString = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);
    let time = Date.now();
    let generateRandomId = String(time) + randomString();
    let filePath = '/server_data/services/nsfw_detector/temperory/' + generateRandomId + '.' + getFile.type;
    this.server.FS.writeFileSync(process.cwd() + filePath, getFile.file);

    try {
      const getNSFWDetectorData = await fetch(this.server.env.SERVICE_NSFW_DETECTOR + '/detect-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_path: process.cwd() + filePath
        })
      });
      const getNSFWDetectorDataJson = await getNSFWDetectorData.json();
      
      if(getDataIntegratedApplicationsModel !== null) {
        let saveFilePath = null;
        if(getNSFWDetectorDataJson.image_label === 'porn') saveFilePath = '/server_data/services/nsfw_detector/detected/' + generateRandomId + '.' + getFile.type;
        if(getNSFWDetectorDataJson.image_label === 'neutral') saveFilePath = '/server_data/services/nsfw_detector/undetected/' + generateRandomId + '.' + getFile.type;
        
        // decrement balance in integrated application with update
        await this.IntegratedApplicationsModel.update({
          balance: getDataIntegratedApplicationsModel.dataValues.balance - 1
        }, {
          where: {
            id: getDataIntegratedApplicationsModel.dataValues.id
          }
        });

        await this.NSFWDetectionModel.create({
          integrated_application_id: getDataIntegratedApplicationsModel.dataValues.id,
          image_path: saveFilePath,
          image_label: getNSFWDetectorDataJson.image_label === "porn" ? "Porn" : "Neutral",
          image_score: getNSFWDetectorDataJson.image_score
        });
      }

      this.server.sendLogs('NSFW Detector Data: ' + JSON.stringify(getNSFWDetectorDataJson));
      this.server.FS.unlinkSync(process.cwd() + filePath);
      
      return getNSFWDetectorDataJson; 
    } catch (error) {
      this.server.sendLogs('Error: ' + error);
      this.server.FS.unlinkSync(process.cwd() + filePath);
      return -500;
    }
  }
}

export default NSFWDetectorService;