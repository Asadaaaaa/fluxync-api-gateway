import PrimaryHandler from './primary/Handler.route.js';

class Handler {
  constructor(server) {
    new PrimaryHandler(server);
  }
}

export default Handler;