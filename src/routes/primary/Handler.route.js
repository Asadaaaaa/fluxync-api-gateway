import Services from "./Services.route.js";

class PrimaryHandler {
  constructor(server) {
    new Services(server);
  }
}

export default PrimaryHandler;