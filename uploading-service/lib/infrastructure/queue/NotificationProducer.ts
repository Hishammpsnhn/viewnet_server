import amqp from "amqplib";
import environment from "../config/environment";

interface Metadata {
  title: string;
  thumbnailUrl: string;
}
export class LiveProducer {
  private readonly queueName: string = "movie_uploaded";

  async sendLiveNotification(metaData: any): Promise<void> {
    let connection;
    let channel;

    try {
      if(!environment.RABBITMQ_URL) return;
      connection = await amqp.connect(environment.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        title: metaData.title ,
        startedBy: Date.now(),
        thumbnailUrl: metaData.thumbnailUrl,
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
