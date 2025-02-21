const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID, 
    pass: process.env.PASS_KEY,
  },
});

// RabbitMQ connection and queue setup
const connectToRabbitMQ = async () => {
  console.log("Connecting to RabbitMQ...");
  let connection;
  let retries = 5;

  while (retries) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      console.log("Connection established");
      const channel = await connection.createChannel();

      // Declare the queue
      const queueName = 'user_notifications'; // Ensure this matches your producer's queue name
      await channel.assertQueue(queueName, { durable: true });
      console.log(`Queue "${queueName}" asserted successfully`);
      return { channel, queueName };
    } catch (error) {
      console.error('Error connecting to RabbitMQ, retrying...', error);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds before retrying
    }
  }

  throw new Error('Failed to connect to RabbitMQ after multiple attempts');
};

// Send email notification
const sendNotification = async (emailData) => {
  console.log('Sending email notification process');
  try {
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: 'hishammpsnhn@gmail.com',
      subject: emailData.subject,
      text: emailData.text,
    };

    console.log('Mail options:', mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Consume messages from RabbitMQ
const startConsuming = async () => {
  const { channel, queueName } = await connectToRabbitMQ();

  console.log(`Waiting for messages in "${queueName}"...`);

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      try {
        const emailData = JSON.parse(msg.content.toString());
        console.log('Received message:', emailData);
        sendNotification(emailData);
        channel.ack(msg); 
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg); 
      }
    }
  });
};

// Start the consumer
startConsuming();
