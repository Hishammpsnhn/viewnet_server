import amqp from "amqplib";
import environment from "../config/environment";

export class TranscodingProducer {
  private readonly queueName: string = "movie_transcoding";

  async TriggerTranscoding(metaData: any): Promise<void> {
    let connection;
    let channel;

    try {
      if (!environment.RABBITMQ_URL) return;
      connection = await amqp.connect(environment.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        key: `uploads/${metaData._id}_video.mp4`,
        bucket_name: environment.AWS_BUCKET_NAME,
        movieName: metaData._id
      };
      const bufferMessage = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(this.queueName, bufferMessage, { persistent: true });
    } catch (error) {
      console.error("Error in MovieProducer:", error);
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }
}
