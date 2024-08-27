import Admin from "./Admin.js";
import IntegratedApplicationController from "../../controllers/admin/IntegratedApplication.controller.js";

class IntegratedApplicationRoute extends Admin {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/integrated-app';
    this.IntegratedApplicationController = new IntegratedApplicationController(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix + '/create', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.createApp(req, res));
    this.API.get(this.endpointPrefix + '/detail', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.detailApp(req, res));
    this.API.get(this.endpointPrefix + '/list', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.listApp(req, res));
    this.API.delete(this.endpointPrefix + '/delete', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.deleteApp(req, res));
    this.API.put(this.endpointPrefix + '/edit', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.editApp(req, res));
    this.API.get(this.endpointPrefix + '/stats', this.AuthorizationMiddleware.check(), (req, res) => this.IntegratedApplicationController.appStats(req, res));
  }
}

export default IntegratedApplicationRoute;
