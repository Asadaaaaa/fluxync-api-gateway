// Models
import IntegratedApplicationsModel from "../../models/IntegratedApplication.model.js";
import NSFWDetectionModel from "../../models/NSFWDetection.model.js";

// Helpers
import FileSystemHelper from "../../helpers/FileSystem.helper.js";

// Library
import { customAlphabet } from "nanoid";

class AuthService {
  constructor(server) {
    this.server = server;
    
    // Init Models
    this.IntegratedApplicationsModel = new IntegratedApplicationsModel(this.server).table;
    this.NSFWDetectionModel = new NSFWDetectionModel(this.server).table;
    
    // Init Helpers
    this.FileSystemHelper = new FileSystemHelper(this.server);
  }

  async createApp(name, email, logo) {
    let validateLogo = null;
    let logoPath = null;
    if(logo !== null) {
      validateLogo = await this.FileSystemHelper.fileValidationBase64(logo, ['png', 'jpg', 'jpeg'], 2, true, true);
      if(validateLogo === -1) return -1;
      if(validateLogo === -2) return -2;
      if(validateLogo === -3) return -3;
    }

    const modelTransaction = await this.server.model.db.transaction();
    try {
      const secret_key = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 60);

      const addIntegratedApp = await this.IntegratedApplicationsModel.create({
        user_id: 1,
        name: name,
        email: email,
        secret_key: secret_key(),
        balance: 10
      }, { transaction: modelTransaction });
      
      if(logo !== null) {
        logoPath = "/server_data/integrated_apps/logo/" + addIntegratedApp.dataValues.uuid + "." + validateLogo.type;
        this.server.FS.writeFileSync(process.cwd() + logoPath, validateLogo.file);

        await addIntegratedApp.update({
          logo_path: logoPath
        }, {
          where: {
            id: addIntegratedApp.dataValues.id
          },
          transaction: modelTransaction
        });
      }

      await modelTransaction.commit();
    } catch (err) {
      console.log(err);

      if(logoPath !== null) this.server.FS.unlinkSync(process.cwd() + logoPath);
      await modelTransaction.rollback();

      return -500;
    }

    return 1;
  }

  async detailApp(uuid) {
    const getApp = await this.IntegratedApplicationsModel.findOne({
      where: {
        uuid: uuid
      }
    });

    if(getApp === null) return -1;

    if(getApp.dataValues.logo_path !== null) {
      // get and convert to base64
      getApp.dataValues.logo = this.server.FS.readFileSync(process.cwd() + getApp.dataValues.logo_path, { encoding: 'base64' });
    } else {
      getApp.dataValues.logo = null;
    }
    
    delete getApp.dataValues.logo_path;
    
    return getApp;
  }

  async listApp() {
    const listApps = await this.IntegratedApplicationsModel.findAll({
      where: {
        user_id: 1
      },
      attributes: {
        exclude: ['id', 'user_id', 'secret_key']
      }
    });

    for (let listApp of listApps) {
      if (listApp.dataValues.logo_path !== null) {
        // get and convert to base64
        listApp.dataValues.logo = this.server.FS.readFileSync(process.cwd() + listApp.dataValues.logo_path, { encoding: 'base64' });
      } else {
        listApp.dataValues.logo = null;
      }
      
      delete listApp.dataValues.logo_path;
    }

    return listApps;
  }

  async deleteApp(uuid) {
    const getApp = await this.IntegratedApplicationsModel.findOne({
      where: {
        uuid: uuid
      }
    });

    if(getApp === null) return -1;

    const modelTransaction = await this.server.model.db.transaction();
    try {
      if(getApp.dataValues.logo_path !== null) this.server.FS.unlinkSync(process.cwd() + getApp.dataValues.logo_path);

      await getApp.destroy({ transaction: modelTransaction });
      await modelTransaction.commit();
    } catch (err) {
      console.log(err);

      await modelTransaction.rollback();

      return -500;
    }

    return 1;
  }

  async editApp(uuid, name, email, balance, logo) {
    const getApp = await this.IntegratedApplicationsModel.findOne({
      where: {
        uuid: uuid
      }
    });

    if(getApp === null) return -1;

    let validateLogo = null;
    let logoPath = null;
    if(logo !== null) {
      validateLogo = await this.FileSystemHelper.fileValidationBase64(logo, ['png', 'jpg', 'jpeg'], 2, true, true);
      if(validateLogo === -1) return -2;
      if(validateLogo === -2) return -3;
      if(validateLogo === -3) return -4;
    }

    const modelTransaction = await this.server.model.db.transaction();
    try {
      await getApp.update({
        name: name,
        email: email,
        balance: balance
      }, { transaction: modelTransaction });

      if(logo !== null) {
        logoPath = "/server_data/integrated_apps/logo/" + getApp.dataValues.uuid + "." + validateLogo.type;
        this.server.FS.writeFileSync(process.cwd() + logoPath, validateLogo.file);

        await getApp.update({
          logo_path: logoPath
        }, {
          where: {
            id: getApp.dataValues.id
          },
          transaction: modelTransaction
        });
      }

      await modelTransaction.commit();
    } catch (err) {
      console.log(err);

      if(logoPath !== null) this.server.FS.unlinkSync(process.cwd() + logoPath);
      await modelTransaction.rollback();

      return -500;
    }

    return 1;
  }

  async appStats(uuid) {
    const getApp = await this.IntegratedApplicationsModel.findOne({
      where: {
        uuid: uuid
      }
    });

    if(getApp === null) return -1;

    const data = {
      balance: getApp.dataValues.balance,
      total_detection: await this.NSFWDetectionModel.count({
        where: {
          integrated_application_id: getApp.dataValues.id
        }
      }),
      total_porn: await this.NSFWDetectionModel.count({
        where: {
          integrated_application_id: getApp.dataValues.id,
          image_label: "Porn"
        }
      }),
      total_neutral: await this.NSFWDetectionModel.count({
        where: {
          integrated_application_id: getApp.dataValues.id,
          image_label: "Neutral"
        }
      }),
      data_detection: await this.NSFWDetectionModel.findAll({
        where: {
          integrated_application_id: getApp.dataValues.id
        },
        attributes: {
          exclude: ['id', 'integrated_application_id']
        }
      })
    }

    return data;
  }
}

export default AuthService;