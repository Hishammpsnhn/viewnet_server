import amqp from "amqplib";
import { title } from "process";

interface Metadata {
  title: string;
  thumbnailUrl: string;
}
export class LiveProducer {
  private readonly queueName: string = "live_started";

  async sendLiveNotification(metaData: any): Promise<void> {
    let connection;
    let channel;

    try {
      connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        title: metaData.title ,
        startedBy: Date.now(),
        thumbnailUrl: metaData.thumbnailUrl,
      };

      const bufferMessage = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(this.queueName, bufferMessage, { persistent: true });
      //   console.log(`Movie and catalog sent to queue: ${movieData.title}`);
    } catch (error) {
      console.error("Error in MovieProducer:", error);
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }
}
