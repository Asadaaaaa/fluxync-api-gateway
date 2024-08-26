import Primary from './Primary.js';

import NSFWDetectorRoute from './services/NSFWDetector.route.js';

class Services extends Primary {
  constructor(server) {
    super(server);

    this.endpointPrefix = this.endpointPrefix + '/services';

    this.routes();
  }

  routes() {
    new NSFWDetectorRoute(this.server, this.endpointPrefix);
  }
}

export default Services;