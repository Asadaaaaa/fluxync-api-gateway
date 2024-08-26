import NSFWDetectorController from "../../../controllers/primary/services/NSFWDetector.controller.js";

class NSFWDetectorRoute {
  constructor(server, endpointPrefix) {
    this.server = server;
    
    this.endpointPrefix = endpointPrefix + '/nsfw-detector';
    this.NSFWDetectorController = new NSFWDetectorController(this.server);

    this.routes();
  }

  routes() {
    // Demo Prediction
    this.server.API.post(
      this.endpointPrefix + '/demo',
      (req, res) => this.NSFWDetectorController.demoDetector(req, res)
    );
    
  }
}

export default NSFWDetectorRoute;