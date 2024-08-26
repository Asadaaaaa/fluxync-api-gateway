import AuthorizationMiddleware from "../../middlewares/primary/Authorization.middleware.js";

class Primary {
  constructor(server) {
    this.server = server;

    this.endpointPrefix = '/' + this.server.env.API_VERSION + '/primary';
    this.AuthorizationMiddleware = new AuthorizationMiddleware(this.server);
  }
}

export default Primary;