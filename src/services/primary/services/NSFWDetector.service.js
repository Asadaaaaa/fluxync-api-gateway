import FileSystemHelper from "../../../helpers/FileSystem.helper.js";

import { customAlphabet } from 'nanoid';

class NSFWDetectorService {
  constructor(server) {
    this.server = server;

    this.FileSystemHelper = new FileSystemHelper(this.server);    
  }

  async demoDetector(image) {
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
      
      this.server.sendLogs('NSFW Detector Data: ' + JSON.stringify(getNSFWDetectorDataJson));
      this.server.FS.unlinkSync(process.cwd() + filePath);
      
      return getNSFWDetectorDataJson; 
    } catch (error) {
      this.server.sendLogs('Error: ' + error);
      this.server.FS.unlinkSync(process.cwd() + filePath);
      return -4;
    }
  }
}

export default NSFWDetectorService;