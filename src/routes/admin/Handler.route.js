import AuthRoute from "./Auth.route.js";
import IntegratedApplicationRoute from "./IntegratedApplication.route.js";

class AdminHandler {
  constructor(server) {
    new AuthRoute(server);
    new IntegratedApplicationRoute(server);
  }
}

export default AdminHandler;