import Admin from "./Admin.js";
import AuthController from "../../controllers/admin/Auth.controller.js";

class AuthRoute extends Admin {
  constructor(server) {
    super(server);
    
    this.endpointPrefix = this.endpointPrefix + '/auth';
    this.AuthController = new AuthController(this.server);

    this.routes();
  }

  routes() {
    this.API.post(this.endpointPrefix + '/login', (req, res) => this.AuthController.login(req, res));
    this.API.get(this.endpointPrefix + '/token-check', this.AuthorizationMiddleware.check(), (req, res) => this.AuthController.tokenCheck(req, res));
  }
}

export default AuthRoute;
