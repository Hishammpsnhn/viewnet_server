import * as amqp from "amqplib";
import http from "http";
import { Server, Socket } from "socket.io";

const PORT = 5006;

// Interface for event data
interface MovieUploadedEvent {
  title: string;
  uploadedBy: string;
}

interface PlanPurchasedEvent {
  userId: string;
  planName: string;
}

interface LiveStartedEvent {
  title: string;
  startedBy: string;
  thumbnailUrl: string;
}

// Map to track connected users
const connectedUsers: Map<string, Socket> = new Map();

// Create an HTTP server and attach Socket.IO
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// WebSocket logic
io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);

  // Register user by userId
  socket.on("register", (userId: string) => {
    console.log(`User registered: ${userId}`);
    connectedUsers.set(userId, socket);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    connectedUsers.forEach((value, key) => {
      if (value === socket) connectedUsers.delete(key);
    });
  });
});

// Function to consume RabbitMQ events
async function consumeRabbitMQ(): Promise<void> {
  try {
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    console.log("Connection established");
    const channel = await connection.createChannel();

    // Define queues
    const queues = ["movie_uploaded", "plan_purchased", "live_started"];

    // Assert queues
    for (const queue of queues) {
      await channel.assertQueue(queue);
    }

    // Consume messages from each queue
    queues.forEach((queue) => {
      channel.consume(queue, (message) => {
        if (message) {
          const event = JSON.parse(message.content.toString());
          console.log(`Received event from ${queue}:`, event);

          // Send notification based on queue type
          sendNotification(queue, event);

          // Acknowledge message
          channel.ack(message);
        }
      });
    });
  } catch (error) {
    console.error("Error in RabbitMQ consumer:", error);
  }
}

// Function to send notifications
function sendNotification(eventType: string, data: any): void {
  console.log(data);
  let notificationMessage: string;

  switch (eventType) {
    case "movie_uploaded":
      const movieData = data as MovieUploadedEvent;
      notificationMessage = `New movie uploaded: ${movieData.title}`;
      break;

    case "plan_purchased":
      const planData = data as PlanPurchasedEvent;
      notificationMessage = `New plan purchased by user: ${planData.userId}`;
      break;

    case "live_started":
      const liveData = data as LiveStartedEvent;
      notificationMessage = `Live stream started: ${liveData.title}`;
      break;

    default:
      notificationMessage = "Unknown event received.";
  }

  console.log("Sending notification:", notificationMessage);

  // Broadcast to all connected users (or specific users)
  connectedUsers.forEach((socket) => {
    console.log(socket)
    socket.emit("notification", { message: notificationMessage });
  });
}

// Start consuming RabbitMQ events
consumeRabbitMQ().catch((err) => console.error(err));

// Start the server
server.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
