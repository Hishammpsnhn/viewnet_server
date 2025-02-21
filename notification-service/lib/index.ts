import bootstrap from "./infrastructure/config/bootstrap";
import environment from "./infrastructure/config/environment";
import { RabbitMQConsumer } from "./infrastructure/RabbitMQConsumer";
import createServer from "./infrastructure/webserver/server";
import { WebSocketServer } from "./infrastructure/WebSocketServer";
import http from "http";

const start = async () => {
  try {
    await bootstrap.init();

    const app = await createServer();
    const port = environment.PORT || 5006;

    const httpServer = http.createServer(app);

    const webSocketServer = new WebSocketServer(httpServer);
    const rabbitMQConsumer = new RabbitMQConsumer(webSocketServer);

    rabbitMQConsumer.consume().catch((err) => console.error(err));
    
    httpServer.listen(port, () => {
      console.log(
        `[ SERVICE :: NOTIFICATION SERVICE ] Content Service is listening on http://localhost:${port}`
      );
    });
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

start();
