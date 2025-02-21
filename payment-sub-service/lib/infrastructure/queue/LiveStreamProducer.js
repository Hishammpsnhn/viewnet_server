import amqp from 'amqplib'
import environment from '../config/environment.js';

class LiveProducer {
  constructor() {
    this.queueName = "plan_purchased";
  }

  async sendLiveNotification(metaData) {
    let connection;
    let channel;

    try {
      connection = await amqp.connect(environment.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        title: metaData.title,
        userId:metaData.userId,
        planId:metaData.planId,
        price:metaData.price,
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

export default LiveProducer;
