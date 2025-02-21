import amqp from 'amqplib';
import environment from '../config/environment.js';

const sendNotificationToQueue = async (email, subject, text) => {
  try {
    const connection = await amqp.connect(environment.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "user_notifications";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({ email, subject, text });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("Notification message sent to queue:", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error sending notification to RabbitMQ:", error);
  }
};

export default sendNotificationToQueue;
