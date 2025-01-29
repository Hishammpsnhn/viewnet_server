import bootstrap from "./infrastructure/config/bootstrap";
import environment from "./infrastructure/config/environment";
import createServer from "./infrastructure/webserver/server";
// import bootstrap from "./lib/infrastructure/config/bootstrap.js";
// import environment from "./lib/infrastructure/config/environment.js";
// import metricsService from "./lib/infrastructure/monitor/metricsService.js";

const start = async () => {
  try {
    await bootstrap.init();

    const app = await createServer();
    const port = environment.PORT || 5003;
    app.listen(port, () => {
      console.log(
        `[ SERVICE :: UPLOADING SERVICE ] Uploading Service is listening on http://localhost:${port}`
      );
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
