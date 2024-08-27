import AuthorizationMiddleware from "../../middlewares/admin/Authorization.middleware.js";

class Admin {
  constructor(server) {
    this.server = server;
    this.API = this.server.API;
    
    this.endpointPrefix = '/' + this.server.env.API_VERSION + '/admin';
    this.AuthorizationMiddleware = new AuthorizationMiddleware(this.server);
  }
}

export default Admin;