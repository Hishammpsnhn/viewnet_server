import bootstrap from "./infrastructure/config/bootstrap";
import environment from "./infrastructure/config/environment";
import createServer from "./infrastructure/webserver/server";
// import bootstrap from "./lib/infrastructure/config/bootstrap.js";
// import environment from "./lib/infrastructure/config/environment.js";
// import metricsService from "./lib/infrastructure/monitor/metricsService.js";
// src/main.ts (starting the consumer)
// import { MovieConsumer } from './infrastructure/queue/movieConsumer';

// const movieConsumer = new MovieConsumer();

const start = async () => {
  try {
    await bootstrap.init();
    
    const app = await createServer();
    // movieConsumer.start(); 
    const port = environment.PORT || 5004;
    app.listen(port, () => {
      console.log(
        `[ SERVICE :: CONTENT SERVICE ] Content Service is listening on http://localhost:${port}`
      );
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
