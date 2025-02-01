import amqp from "amqplib";
import { VideoMetadata } from "../../domain/entities/VideoMetadata";
import { MovieCatalog } from "../../domain/entities/VideoCatalog";

export class MovieProducer {
  private readonly queueName: string = "movie_upload_queue";

  async sendMovie(movieData: VideoMetadata): Promise<void> {
    let connection;
    let channel;

    try {
      connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        // catalog: catalog,  
        movieData: movieData
      };

      const bufferMessage = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(this.queueName, bufferMessage, { persistent: true });
      console.log(`Movie and catalog sent to queue: ${movieData.title}`);
    } catch (error) {
      console.error("Error in MovieProducer:", error);
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }
}
