import * as amqp from "amqplib";
import { NotifyUsersUseCase } from "../usecase/NotifyUsersUseCase";
import { NotificationSender } from "../domain/interface/NotificationSender";
import NotificationRepositoryImpl from "../infrastructure/repository/NotificationRepository";
import UserGateway from "../gateway/userGateway";
import axios from "axios";

const userGateway  = new UserGateway(axios);

export class RabbitMQConsumer {
  private useCase: NotifyUsersUseCase;

  constructor(notificationSender: NotificationSender) {
    const notificationRepository = new NotificationRepositoryImpl();
    this.useCase = new NotifyUsersUseCase(notificationSender, notificationRepository,userGateway);
  }

  async consume(): Promise<void> {
    try {
      const connection = await amqp.connect("amqp://rabbitmq:5672");
      const channel = await connection.createChannel();

      const queues = ["movie_uploaded", "plan_purchased", "live_started"];
      for (const queue of queues) {
        await channel.assertQueue(queue);
        channel.consume(queue, async (message) => {
          if (message) {
            try {
              const event = JSON.parse(message.content.toString());
              console.log("message received: " , event)
              await this.useCase.execute(queue, event); 
              channel.ack(message);
            } catch (err) {
              console.error(`Failed to process message from queue ${queue}:`, err);
              // Do not acknowledge message so it can be retried later
            }
          }
        });
      }
    } catch (error) {
      console.error("Error in RabbitMQ consumer:", error);
    }
  }
}
